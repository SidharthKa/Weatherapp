# 🌍 ClimateCompare Dashboard

> **NASA Space Apps Challenge 2025**  
> A multi-location weather intelligence platform powered by NASA POWER API

[![Python](https://img.shields.io/badge/Python-3.7+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

![ClimateCompare Dashboard](https://via.placeholder.com/800x400/0066cc/ffffff?text=ClimateCompare+Dashboard)

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Technologies](#technologies)
- [Screenshots](#screenshots)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Team](#team)
- [Acknowledgments](#acknowledgments)

---

## 🎯 About

ClimateCompare Dashboard is an interactive web application that enables users to compare weather patterns across multiple locations using NASA's POWER (Prediction Of Worldwide Energy Resources) API. The tool is designed for:

- 🌾 **Farmers** - Optimal crop planning and irrigation scheduling
- ⚡ **Renewable Energy Planners** - Solar and wind farm site selection
- 🏗️ **Urban Planners** - Climate-resilient infrastructure design
- 🔬 **Researchers** - Climate trend analysis and comparative studies
- 🌍 **Environmental Scientists** - Regional climate pattern investigation

### Why ClimateCompare?

Traditional weather data tools are often complex, require specialized knowledge, or lack comparative analysis features. ClimateCompare democratizes access to NASA's scientific climate data through:

- **Simple Interface** - Click on a map, select dates, get insights
- **Comparative Analysis** - Side-by-side comparison of up to 2 locations
- **Probability Metrics** - Understand likelihood of extreme weather events
- **Visual Insights** - Interactive charts for easy interpretation
- **Export Capability** - PDF reports for presentations and documentation

---

## ✨ Features

### Core Functionality
- 🗺️ **Interactive Map Interface** - Leaflet-powered location selection
- 📊 **Multiple Weather Parameters**:
  - Temperature (°C)
  - Precipitation (mm/day)
  - Wind Speed (m/s)
  - Relative Humidity (%)
  - Solar Radiation (kWh/m²/day)
- 📈 **Time Series Visualization** - Track trends over custom date ranges
- 📉 **Probability Analysis** - Calculate days exceeding thresholds
- 🔄 **Multi-Location Comparison** - Compare up to 2 locations simultaneously
- 📄 **PDF Export** - Generate downloadable reports
- 🌓 **Dark/Light Theme** - Toggle between themes with persistence
- 🌫️ **Air Quality Integration** - Placeholder for NASA GES DISC data

### Technical Features
- ⚡ **Fast API Response** - Optimized backend with caching potential
- 🔒 **CORS Enabled** - Secure cross-origin requests
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI/UX** - Clean, intuitive interface
- 🔄 **Real-time Updates** - Dynamic chart rendering
- ⚠️ **Error Handling** - Comprehensive validation and user feedback

---

## 🎥 Demo

### Live Demo
[Coming Soon - Add deployed URL here]


### Sample Analysis
```
Parameter: Temperature (°C)
Date Range: January 1, 2023 - December 31, 2023
Locations: New York, NY vs Los Angeles, CA
Threshold: 25°C

Results:
- New York: 45% of days above 25°C
- Los Angeles: 78% of days above 25°C
- Recommendation: New York has lower probability of heat events
```

---

## 🚀 Installation

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for map tiles and NASA API)

### Quick Install

```bash
# Clone or download the project
git clone https://github.com/yourusername/climatecompare.git
cd climatecompare

# Setup backend with virtual environment
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python app.py
```

**In a new terminal:**

```bash
# Navigate to frontend
cd climatecompare/frontend

# Start frontend server
python -m http.server 8000
```

**Open browser:**
```
http://localhost:8000
```

### Detailed Installation

For step-by-step installation with troubleshooting, see [INSTALL.md](INSTALL.md)

---

## 💻 Usage

### Basic Workflow

1. **Select Locations**
   - Click on the map to add location pins (max 2)
   - Coordinates are automatically captured
   - Remove pins individually or clear all

2. **Configure Analysis**
   - Choose weather parameter from dropdown
   - Set start date (past date)
   - Set end date (past date, after start date)
   - Set threshold value (optional, for probability analysis)

3. **Run Analysis**
   - Click "📊 Get Data & Analyze"
   - Wait 5-15 seconds for NASA API response
   - Review charts and summary

4. **Export Results**
   - Click "📄 Download PDF Report"
   - Save analysis for presentations or records

### Example Use Cases

#### Agricultural Planning
```
Goal: Compare growing conditions for corn in two regions
Parameter: Temperature
Date Range: Growing season (May - September)
Threshold: 32°C (heat stress threshold)
Result: Identify region with fewer high-heat days
```

#### Solar Farm Site Selection
```
Goal: Find optimal location for solar installation
Parameter: Solar Radiation (kWh/m²/day)
Date Range: Full year
Threshold: 4.0 kWh/m²/day
Result: Compare total solar energy potential
```

#### Urban Heat Island Study
```
Goal: Compare urban vs rural temperatures
Parameter: Temperature
Date Range: Summer months
Threshold: 30°C
Result: Quantify heat island effect
```

---

## 📁 Project Structure

```
climatecompare/
├── backend/
│   ├── venv/                      # Virtual environment (not in git)
│   ├── app.py                     # Flask API server
│   ├── server.js                  # Alternative Node.js server
│   ├── requirements.txt           # Python dependencies
│   └── package.json              # Node.js dependencies (optional)
│
├── frontend/
│   ├── index.html                # Main HTML structure
│   ├── script.js                 # Frontend logic
│   └── style.css                 # Styling and themes
│
├── docs/
│   ├── INSTALL.md               # Detailed installation guide
│   ├── API.md                   # API documentation
│   └── CONTRIBUTING.md          # Contribution guidelines
│
├── .gitignore                   # Git ignore rules
├── README.md                    # This file
└── LICENSE                      # MIT License

```

### Key Files Description

- **app.py** - Flask backend server that proxies NASA POWER API requests
- **index.html** - Dashboard interface with Leaflet map and Chart.js
- **script.js** - Frontend logic for map interaction, API calls, and charting
- **style.css** - Responsive styling with dark/light theme support
- **requirements.txt** - Python package dependencies

---

## 🔌 API Documentation

### Backend Endpoints

#### GET /api/weather

Fetch historical weather data from NASA POWER API.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lat | float | Yes | Latitude (-90 to 90) |
| lon | float | Yes | Longitude (-180 to 180) |
| parameter | string | Yes | Weather parameter (T2M, PRECTOTCORR, etc.) |
| start | string | Yes | Start date (YYYY-MM-DD) |
| end | string | Yes | End date (YYYY-MM-DD) |

**Example Request:**
```bash
GET http://localhost:5000/api/weather?lat=28.6139&lon=77.2090&parameter=T2M&start=2023-01-01&end=2023-12-31
```

**Example Response:**
```json
{
  "properties": {
    "parameter": {
      "T2M": {
        "20230101": 15.5,
        "20230102": 16.2,
        "20230103": 14.8,
        ...
      }
    }
  }
}
```

#### GET /api/aq

Fetch air quality data (placeholder for NASA GES DISC integration).

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lat | float | Yes | Latitude |
| lon | float | Yes | Longitude |
| start | string | Yes | Start date |
| end | string | Yes | End date |

**Example Response:**
```json
{
  "summary": "Air quality data requires NASA Earthdata credentials.",
  "status": "placeholder"
}
```

### NASA POWER API

This project uses NASA's POWER API:
- **Base URL:** https://power.larc.nasa.gov/api/temporal/daily/point
- **Documentation:** https://power.larc.nasa.gov/docs/
- **Data Coverage:** 1981 - Present (with ~1-2 month lag)
- **Spatial Resolution:** 0.5° x 0.625°
- **No Authentication Required**

**Available Parameters:**
- `T2M` - Temperature at 2 Meters (°C)
- `T2M_MAX` - Maximum Temperature (°C)
- `T2M_MIN` - Minimum Temperature (°C)
- `PRECTOTCORR` - Precipitation (mm/day)
- `WS10M` - Wind Speed at 10 Meters (m/s)
- `RH2M` - Relative Humidity at 2 Meters (%)
- `ALLSKY_SFC_SW_DWN` - All Sky Surface Shortwave Downward Irradiance (kWh/m²/day)

---

## 🛠️ Technologies

### Backend
- **Flask 3.0.0** - Python web framework
- **Flask-CORS 4.0.0** - Cross-origin resource sharing
- **Requests 2.31.0** - HTTP library for API calls
- **Python 3.7+** - Programming language

### Frontend
- **Vanilla JavaScript (ES6+)** - No frameworks, pure JS
- **Chart.js 4.4.0** - Interactive charts
- **Leaflet 1.9.4** - Interactive maps
- **html2canvas 1.4.1** - Screenshot capture
- **jsPDF 2.5.1** - PDF generation
- **OpenStreetMap** - Map tiles

### APIs & Data Sources
- **NASA POWER API** - Weather data
- **NASA GES DISC** - Air quality data (planned)

---

## 📸 Screenshots

### Main Dashboard
![Dashboard](https://via.placeholder.com/800x500/eef6f8/0b2340?text=Main+Dashboard)
*Interactive map and data controls*

### Time Series Chart
![Time Series](https://via.placeholder.com/800x400/ffffff/0066cc?text=Time+Series+Chart)
*Temperature comparison over time*

### Probability Analysis
![Probability](https://via.placeholder.com/800x400/ffffff/ff7043?text=Probability+Chart)
*Days above threshold comparison*

### Dark Theme
![Dark Theme](https://via.placeholder.com/800x500/0f1720/e6eef8?text=Dark+Theme)
*Dashboard in dark mode*

---

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Error: ModuleNotFoundError: No module named 'flask'
Solution: pip install flask flask-cors requests

# Error: Port 5000 already in use
Solution: Change port in app.py or kill process
```

#### Frontend issues
```bash
# Map not loading
Solution: Check internet connection, hard refresh (Ctrl + F5)

# CORS errors
Solution: Ensure backend is running and CORS is enabled
```

#### Data fetching issues
```bash
# 502 Bad Gateway
Solution: Check dates are in the past, not future

# Invalid coordinates
Solution: Latitude: -90 to 90, Longitude: -180 to 180
```

For more troubleshooting, see [INSTALL.md](INSTALL.md)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 ClimateCompare Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👥 Team

**Team Name:** [ASPIRE]  
**Challenge:** NASA Space Apps Challenge 2025  


**Team Members:**
- **[SIDHARTH K A]** - Backend Development & API Integration
- **[ANAKHA G & JESSICA CHERIYAN]** - Frontend Development & UI/UX Design
- **[K M MEENAKSHI & ANGEL SABU]** - Data Analysis & Testing
- **[LEKSHMI SABU]** - Documentation & Presentation

---

## 🙏 Acknowledgments

- **NASA POWER Team** - For providing free, high-quality weather data
- **OpenStreetMap Contributors** - For map tiles and data
- **Chart.js Community** - For excellent visualization library
- **Leaflet Community** - For powerful mapping tools
- **NASA Space Apps Challenge** - For organizing this amazing event
- **Flask & Python Community** - For robust web framework

---

## 📊 Project Stats

- **Lines of Code:** ~1,500
- **Development Time:** [X] hours
- **NASA API Calls:** Optimized with caching potential
- **Supported Parameters:** 7+ weather variables
- **Max Locations:** 2 (expandable)
- **Date Range:** 1981 - Present
- **Response Time:** 5-15 seconds per analysis

---

## 🚀 Future Enhancements

- [ ] Complete NASA GES DISC air quality integration
- [ ] Support for 3+ location comparisons
- [ ] Historical trend analysis (year-over-year)
- [ ] Email report delivery
- [ ] Save/load analysis sessions
- [ ] API rate limiting and caching
- [ ] User authentication system
- [ ] Mobile app version (React Native)
- [ ] Machine learning predictions
- [ ] Integration with more NASA datasets

---

## 📞 Support

Having issues? Here's how to get help:

1. **Check Documentation** - Review this README and INSTALL.md
2. **Search Issues** - Look for similar problems in GitHub Issues
3. **Create New Issue** - Provide detailed description with:
   - Operating system
   - Python version
   - Error messages
   - Steps to reproduce
4. **Contact Team** - Email us at [support-email@example.com]

---

## 🌟 Star Us!

If you find this project useful, please consider giving it a star ⭐ on GitHub!

---

## 📅 Version History

### v1.0.0 (October 2025)
- Initial release
- Core weather data comparison functionality
- Interactive map with pin selection
- Time series and probability charts
- PDF export capability
- Dark/light theme toggle

### v0.5.0 (Beta)
- Backend API development
- Frontend UI implementation
- NASA POWER API integration

---

## 🔗 Useful Links

- [NASA POWER API Documentation](https://power.larc.nasa.gov/docs/)
- [NASA GES DISC](https://disc.gsfc.nasa.gov/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [NASA Space Apps Challenge](https://www.spaceappschallenge.org/)

---

<div align="center">

**Built with ❤️ for NASA Space Apps Challenge 2025**

[Report Bug](https://github.com/yourusername/climatecompare/issues) · 
[Request Feature](https://github.com/yourusername/climatecompare/issues) · 
[Documentation](https://github.com/yourusername/climatecompare/wiki)

</div>
