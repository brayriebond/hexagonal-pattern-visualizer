exports.handler = async (event, context) => {
  // Sample data for visualization
  const data = [
    { id: 1, name: 'A', value: 20 },
    { id: 2, name: 'B', value: 40 },
    { id: 3, name: 'C', value: 30 },
    { id: 4, name: 'D', value: 60 },
    { id: 5, name: 'E', value: 10 },
  ];
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Enable CORS
    },
    body: JSON.stringify(data),
  };
};
