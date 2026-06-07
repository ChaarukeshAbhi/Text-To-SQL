from flask import Blueprint, request, jsonify
from middleware.prompt_security import check_prompt_security, check_schema_security
from middleware.response_security import check_response_security
from services.groq_service import generate_sql

query_bp = Blueprint("query", __name__)

SUPPORTED_DB_TYPES = ["mysql", "postgresql", "sqlite", "mongodb"]


@query_bp.route("/api/query", methods=["POST"])
def handle_query():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required."}), 400

    prompt = data.get("prompt", "").strip()
    db_type = data.get("dbType", "mysql").strip().lower()
    schema = data.get("schema", "").strip()

    if not prompt:
        return jsonify({"error": "Prompt is required."}), 400

    if db_type not in SUPPORTED_DB_TYPES:
        return jsonify({"error": f"Unsupported database type '{db_type}'."}), 400

    # ── SECURITY LAYER 1A: Schema Check ─────────────────────────────
    if schema:
        schema_check = check_schema_security(schema)
        if not schema_check["safe"]:
            return jsonify({
                "error": schema_check["reason"],
                "blocked": True,
                "layer": "schema_security"
            }), 400

    # ── SECURITY LAYER 1B: Prompt Check ─────────────────────────────
    prompt_check = check_prompt_security(prompt)
    if not prompt_check["safe"]:
        return jsonify({
            "error": prompt_check["reason"],
            "blocked": True,
            "layer": "prompt_security"
        }), 400

    # ── AI GENERATION ────────────────────────────────────────────────
    result = generate_sql(prompt, db_type, schema=schema if schema else None)
    if not result["success"]:
        return jsonify({"error": result["error"]}), 500

    sql = result["sql"]

    # ── SECURITY LAYER 2: Response Check ────────────────────────────
    response_check = check_response_security(sql)

    if response_check["blocked"]:
        return jsonify({
            "error": response_check["reason"],
            "blocked": True,
            "layer": "response_security"
        }), 400

    return jsonify({
        "sql": sql,
        "dbType": db_type,
        "warnings": response_check["warnings"],
        "blocked": False,
        "schemaUsed": bool(schema),
    }), 200


@query_bp.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Text-to-SQL API is running."}), 200