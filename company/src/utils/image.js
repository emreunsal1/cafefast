const CLOUDFRONT_URL = "https://d1w5rwlodabrlm.cloudfront.net";

export const createCloudfrontImageUrl = (imageName) => `${CLOUDFRONT_URL}/${imageName}`;
