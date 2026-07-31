const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

export { getHealth };