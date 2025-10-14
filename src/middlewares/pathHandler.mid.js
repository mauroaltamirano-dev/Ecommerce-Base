const pathHandler = (req, res) => {
  const error = "Not found URL";
  const { method, originalUrl } = req;
  return res.status(404).json({ error, method, originalUrl });
};

export default pathHandler;
