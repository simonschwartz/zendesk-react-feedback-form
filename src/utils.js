// Mock Zendesk API request to allow developers to test form functionality
// without actually senging POST to Zendesk API
export const fakeRequest = (isSuccess: boolean) => {
  const mockResponse = isSuccess
    ? {
        request: {
          id: 33,
          status: "new",
          description: "My printer is on fire!"
        }
      }
    : {};

  return new Promise(resolve => {
    setTimeout(() => resolve(mockResponse), 1000);
  });
};
