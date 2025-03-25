# Virtual Audio Guide - Explore Gujarat

<div align="center">
  <img src="frontend/src/assets/logo.png" alt="Virtual Audio Guide Logo" width="150">
  <h3>Discover the rich cultural heritage of Gujarat with immersive audio experiences</h3>
</div>

## ✨ Features

- 🎧 **Immersive Audio Guides**: Experience historic places with professionally narrated audio tours
- 🏯 **Extensive Place Library**: Explore numerous historical sites across Gujarat
- 📱 **Responsive Design**: Beautiful UI that works perfectly on all devices
- 🗺️ **Tour Packages**: Curated tour packages for the best Gujarat experience
- 🔍 **Advanced Search**: Easily find places of interest with our powerful search
- 👤 **User Profiles**: Save favorite places and manage your booking history
- 🎫 **Online Booking**: Book tour packages directly through the platform

## 📸 Screenshots

<div align="center">
  <img src="frontend/src/assets/screenshots/home.png" alt="Home Page" width="45%">
  <img src="frontend/src/assets/screenshots/places.png" alt="Places Page" width="45%">
</div>

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL (optional, SQLite is used by default)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/virtualaudioguide.git
cd virtualaudioguide
```

2. **Set up the backend**

```bash
cd backend

# Create and activate a virtual environment (optional but recommended)
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser (optional)
python manage.py createsuperuser

# Load demo data (optional)
python manage.py loaddata demo_data.json
```

3. **Set up the frontend**

```bash
cd frontend
npm install
```

### Running the Application

#### On Windows with PowerShell

The easiest way to run both frontend and backend servers on Windows is using our PowerShell script:

```bash
# From the project root
.\run-dev.ps1
```

This will open two terminal windows, one for the backend and one for the frontend.

#### Manual Start

**Backend:**

```bash
cd backend
python manage.py runserver
```

**Frontend:**

```bash
cd frontend
npm start
```

The application should now be running at:
- Frontend: http://localhost:3000
- Backend/API: http://localhost:8000
- Admin interface: http://localhost:8000/admin

## 🏗️ Architecture

The application follows a modern architecture:

- **Backend**: Django REST Framework API
- **Frontend**: React with Bootstrap for responsive UI
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT-based authentication system

## 📱 Mobile Compatibility

The application is fully responsive and optimized for mobile devices, providing a seamless experience across all screen sizes.

## 🛣️ Roadmap

- [ ] Offline audio guide capability
- [ ] Mobile app versions for Android and iOS
- [ ] Multi-language support
- [ ] Augmented reality (AR) features for monuments
- [ ] User reviews and ratings
- [ ] Social sharing functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any questions or suggestions, please reach out to:
- Email: info@virtualaudioguide.com
- Website: https://www.virtualaudioguide.com

---

<div align="center">
  Made with ❤️ for the rich heritage of Gujarat
</div> 