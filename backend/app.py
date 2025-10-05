# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route("/api/weather", methods=["GET"])
def get_weather():
    try:
        lat = request.args.get("lat")
        lon = request.args.get("lon")
        parameter = request.args.get("parameter")
        start = request.args.get("start")
        end = request.args.get("end")

        if not (lat and lon and parameter and start and end):
            return jsonify({"error": "Missing required query parameters"}), 400

        # Convert date format YYYY-MM-DD to YYYYMMDD
        start_str = start.replace("-", "")
        end_str = end.replace("-", "")

        # NASA POWER API endpoint (no authentication required)
        nasa_url = (
            f"https://power.larc.nasa.gov/api/temporal/daily/point?"
            f"parameters={parameter}"
            f"&start={start_str}"
            f"&end={end_str}"
            f"&latitude={lat}"
            f"&longitude={lon}"
            f"&community=RE"
            f"&format=JSON"
        )

        print(f"Fetching NASA data from: {nasa_url}")

        response = requests.get(nasa_url, timeout=30)

        if response.status_code != 200:
            return jsonify({
                "error": "NASA API error",
                "status_code": response.status_code,
                "details": response.text[:500]
            }), 502

        data = response.json()

        # If NASA API returns an error field
        if "messages" in data and len(data.get("messages", [])) > 0:
            return jsonify({
                "error": "NASA returned message",
                "messages": data["messages"]
            }), 502

        return jsonify(data)

    except requests.exceptions.Timeout:
        return jsonify({"error": "Request timeout - NASA API took too long"}), 504
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": f"Server-side exception: {str(e)}"}), 500


@app.route("/api/aq", methods=["GET"])
def get_air_quality():
    """
    Placeholder for Air Quality data from NASA GES DISC
    Note: This requires NASA Earthdata credentials and proper API setup
    """
    try:
        lat = request.args.get("lat")
        lon = request.args.get("lon")
        start = request.args.get("start")
        end = request.args.get("end")

        # Placeholder response - implement actual GES DISC API call here
        return jsonify({
            "summary": f"Air quality data for ({lat}, {lon}) requires NASA Earthdata authentication. Feature coming soon.",
            "status": "placeholder"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "ClimateCompare API Server",
        "endpoints": ["/api/weather", "/api/aq"],
        "status": "running"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000, host='0.0.0.0')