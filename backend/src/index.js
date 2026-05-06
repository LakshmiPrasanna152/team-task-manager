app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://team-task-manager-rho-green.vercel.app/login'
  ],
  credentials: true
}));