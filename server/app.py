import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from routes.query import query_bp

load_dotenv()

app = Flask(__name__)

# Allow requests from React dev server and production
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://localhost:3000"]}})

# Register blueprints
app.register_blueprint(query_bp)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "true").lower() == "true"
    print(f"🚀 Text-to-SQL API running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)