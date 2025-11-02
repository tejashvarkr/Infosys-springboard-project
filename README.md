# Fraud Detection Dashboard# React + TypeScript + Vite



An interactive web dashboard for exploratory data analysis (EDA) of fraud detection data. Built with React, TypeScript, and Recharts, this dashboard provides comprehensive visualizations and statistical insights into transaction fraud patterns.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## FeaturesCurrently, two official plugins are available:



### 📊 **Interactive Visualizations**- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- **Fraud Overview**: Distribution analysis with pie charts, bar charts, and key statistics- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **Categorical Analysis**: Channel and KYC verification patterns

- **Numerical Analysis**: Transaction amount and account age distributions## React Compiler

- **Time Series**: Hourly and daily fraud patterns with trend analysis

- **Correlation Heatmap**: Feature correlations with fraud detectionThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).



### 🎨 **Modern UI/UX**## Expanding the ESLint configuration

- Dark theme optimized for extended viewing

- Smooth animations and transitionsIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- Responsive design for desktop and mobile

- Interactive charts with tooltips and legends```js

- Tab-based navigation for easy explorationexport default defineConfig([

  globalIgnores(['dist']),

### 📈 **Data Insights**  {

- 5,000 transaction dataset with realistic fraud patterns    files: ['**/*.{ts,tsx}'],

- 8.64% fraud rate with detailed imbalance metrics    extends: [

- Multi-channel analysis (ATM, Mobile, POS, Web)      // Other configs...

- Temporal pattern detection (hourly and weekday trends)

- Statistical analysis with quartiles, standard deviations, and correlations      // Remove tseslint.configs.recommended and replace with this

      tseslint.configs.recommendedTypeChecked,

## Technology Stack      // Alternatively, use this for stricter rules

      tseslint.configs.strictTypeChecked,

- **React 18**: Modern UI library      // Optionally, add this for stylistic rules

- **TypeScript**: Type-safe development      tseslint.configs.stylisticTypeChecked,

- **Vite**: Fast build tool and dev server

- **Recharts**: Interactive chart library      // Other configs...

- **Tailwind CSS**: Utility-first styling    ],

- **D3.js**: Advanced data visualization utilities    languageOptions: {

      parserOptions: {

## Getting Started        project: ['./tsconfig.node.json', './tsconfig.app.json'],

        tsconfigRootDir: import.meta.dirname,

### Prerequisites      },

- Node.js 20.x or higher      // other options...

- npm 10.x or higher    },

  },

### Installation])

```

1. **Navigate to the project directory**:

   ```powershellYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

   cd f:\Projects\InfosysVirtualInternship-BFSI\fraud-detection-dashboard

   ``````js

// eslint.config.js

2. **Install dependencies**:import reactX from 'eslint-plugin-react-x'

   ```powershellimport reactDom from 'eslint-plugin-react-dom'

   npm install

   ```export default defineConfig([

  globalIgnores(['dist']),

### Running the Development Server  {

    files: ['**/*.{ts,tsx}'],

Start the development server with hot module replacement:    extends: [

      // Other configs...

```powershell      // Enable lint rules for React

npm run dev      reactX.configs['recommended-typescript'],

```      // Enable lint rules for React DOM

      reactDom.configs.recommended,

The dashboard will be available at `http://localhost:5173`    ],

    languageOptions: {

### Building for Production      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

Create an optimized production build:        tsconfigRootDir: import.meta.dirname,

      },

```powershell      // other options...

npm run build    },

```  },

])

Preview the production build:```


```powershell
npm run preview
```

## Project Structure

```
fraud-detection-dashboard/
├── src/
│   ├── components/           # React components
│   │   ├── FraudDistribution.tsx      # Overview charts
│   │   ├── CategoricalFeatures.tsx    # Channel & KYC analysis
│   │   ├── NumericalFeatures.tsx      # Amount & age distributions
│   │   ├── TimeSeriesAnalysis.tsx     # Temporal patterns
│   │   └── CorrelationHeatmap.tsx     # Feature correlations
│   ├── data/                 # Data generation
│   │   └── mockData.ts                # Mock transaction generator
│   ├── types/                # TypeScript definitions
│   │   └── index.ts                   # All interface definitions
│   ├── utils/                # Utility functions
│   │   └── dataProcessing.ts          # Statistical calculations
│   ├── App.tsx               # Main application component
│   ├── App.css               # Component-specific styles
│   ├── index.css             # Global styles with Tailwind
│   └── main.tsx              # Application entry point
├── public/                   # Static assets
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── package.json              # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Dashboard Sections

### 1. Fraud Overview
- Total transactions and fraud rate
- Fraud vs. legitimate distribution (pie chart)
- Count comparison (bar chart)
- Key statistics (fraud rate, imbalance ratio)

### 2. Categorical Analysis
- Transaction distribution by channel
- Fraud rate comparison across channels
- KYC verification impact on fraud
- Channel-specific fraud patterns

### 3. Numerical Analysis
- Transaction amount statistics (mean, median, std dev, quartiles)
- Account age distribution analysis
- Fraud vs. legitimate comparison
- Range-based histograms and area charts

### 4. Time Series Analysis
- Hourly transaction patterns
- Fraud rate by hour of day
- Weekday transaction trends
- Peak hours identification

### 5. Correlation Heatmap
- Feature correlation with fraud
- Color-coded correlation strength
- Top correlations display
- Positive/negative relationship indicators

## Data Model

The dashboard uses a comprehensive transaction model with 19 features:

```typescript
interface Transaction {
  transaction_id: string;
  customer_id: string;
  account_age_days: number;
  transaction_amount: number;
  timestamp: string;
  is_fraud: number;
  hour: number;
  weekday: number;
  month: number;
  is_high_value: number;
  transaction_amount_log: number;
  channel_Atm: number;
  channel_Mobile: number;
  channel_Pos: number;
  channel_Web: number;
  kyc_verified_No: number;
  kyc_verified_Yes: number;
}
```

## Customization

### Changing Colors
Update the color scheme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#3498db',    // Blue
      secondary: '#2ecc71',  // Green
      danger: '#e74c3c',     // Red
      warning: '#f39c12',    // Orange
      info: '#9b59b6',       // Purple
    },
  },
},
```

### Modifying Mock Data
Edit `src/data/mockData.ts` to change:
- Number of transactions
- Fraud rate percentage
- Channel distribution
- Amount ranges

### Adding New Visualizations
1. Create a new component in `src/components/`
2. Add calculation logic to `src/utils/dataProcessing.ts`
3. Import and render in `App.tsx`

## Performance Considerations

- All calculations are performed once on mount
- Charts use memoization and optimized rendering
- Large datasets are handled with Recharts' virtualization
- Responsive containers adapt to viewport changes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of the Infosys Virtual Internship - BFSI program.

## Contributing

For contributions and issues, please contact the project maintainers.

---

**Built with ❤️ using React, TypeScript, and Recharts**
