import sharp from 'sharp';

export const handler = async (event) => {
  console.log('Lambda Log Event:', event);

  let result = 'event.body is not defined';
  if (event?.body) {
    const input = Buffer.from(event.body, 'base64');
    result = await sharp(input).resize(32, 32).withMetadata().toBuffer();
  }

  const response = {
    statusCode: 201,
    message: 'Resize was successful',
    body: result,
  };

  console.log('response:', response);

  return response;
};
