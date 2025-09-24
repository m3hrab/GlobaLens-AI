#!/bin/bash

echo "🌐 GlobaLens AI Backend Setup & Start"
echo "===================================="

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+"
    exit 1
fi

# Check if we're in the backend directory
if [ ! -f "app/main.py" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Run the application
echo ""
echo "🚀 Starting GlobaLens AI Backend..."
echo "📊 API Documentation: http://localhost:8000/docs"
echo "🔍 Alternative Docs: http://localhost:8000/redoc"
echo "❤️  Health Check: http://localhost:8000/health"
echo "🚀 Ready for frontend integration!"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the server
python3 run.py
