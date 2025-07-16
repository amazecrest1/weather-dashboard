# Weather Data Dashboard

A responsive weather data dashboard built with React, TypeScript, and Recharts that visualizes historical weather data from the Open-Meteo Archive API.

## Features

### 🌤️ Overview Page
- **Daily Temperature Chart**: Line chart showing daily max, min, and average temperatures
- **Daily Precipitation Chart**: Bar chart displaying precipitation amounts
- **Daily Wind Speed Chart**: Line chart showing maximum wind speeds
- **Interactive Filters**: Date range picker and city selector

### 🔍 Detailed Insights Page
- **Hourly Data Visualization**: Select up to 2 parameters from 6 available weather metrics
- **Dual Y-Axis Support**: When selecting parameters with different units
- **Parameter Selection**: Temperature, Humidity, Apparent Temperature, Precipitation, Sea Level Pressure, Wind Speed
- **Dynamic Time Axis**: Automatically adjusts based on selected date range

### 🏙️ City Search & Management
- **Predefined Cities**: New York, London, Tokyo, Sydney, Paris, Dubai
- **City Search**: Search for any city worldwide using OpenStreetMap's geocoding API
- **Custom Cities**: Add and save custom cities beyond the predefined ones
- **Auto-completion**: Real-time search suggestions with debounced API calls
- **Keyboard Navigation**: Full keyboard support with arrow keys and Enter
- **Local Storage**: Custom cities are saved locally for future sessions
- **Remove Custom Cities**: Easy removal of custom cities with one click

### 📱 Responsive Design
- Optimized for tablet to desktop viewing
- Dynamic chart and filter layout
- Modern UI with Tailwind CSS

## Technology Stack

- **React 18** with TypeScript
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Open-Meteo Archive API** for weather data
- **Jest & React Testing Library** for testing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CitySelector.tsx
│   ├── DateRangePicker.tsx
│   ├── ParameterSelector.tsx
│   ├── LoadingSpinner.tsx
│   ├── TemperatureChart.tsx
│   ├── PrecipitationChart.tsx
│   ├── WindSpeedChart.tsx
│   └── MultiParameterChart.tsx
├── pages/              # Main page components
│   ├── Overview.tsx
│   └── DetailedInsights.tsx
├── types/              # TypeScript type definitions
│   └── weather.ts
├── constants/          # App constants and configuration
│   └── cities.ts
├── utils/              # Utility functions
│   └── api.ts
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles
```

## API Integration

The dashboard integrates with the [Open-Meteo Archive API](https://archive-api.open-meteo.com/) to fetch historical weather data:

- **Daily Data**: Temperature (max/min/mean), precipitation, wind speed
- **Hourly Data**: Temperature, humidity, apparent temperature, precipitation, pressure, wind speed
- **Date Range**: Up to 3 months of historical data
- **Timezone**: Automatic timezone detection

## Features in Detail

### Date Range Validation
- Maximum 90-day range
- No future dates allowed
- Real-time validation feedback

### Parameter Selection
- Visual parameter cards with color coding
- Maximum 2 parameters for detailed insights
- Automatic Y-axis assignment based on parameter units

### Chart Interactions
- Responsive design with automatic sizing
- Hover tooltips with formatted data
- Legend support for multi-line charts
- Smooth animations and transitions

### Error Handling
- API error handling with retry functionality
- Loading states during data fetching
- Validation messages for invalid inputs

## Testing

The project includes unit tests for:
- Data transformation functions
- Date validation utilities
- Component rendering
- Chart data parsing

Run tests with:
```bash
npm test
```

## Deployment

Build the project for production:
```bash
npm run build
```

The build folder contains optimized static files ready for deployment to any static hosting service.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Weather data provided by [Open-Meteo](https://open-meteo.com)
- Charts powered by [Recharts](https://recharts.org)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Built with [Create React App](https://create-react-app.dev) 