import { WebhookFetcher } from '../services/ssmHelper';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

// 👇 Mock GetParameterCommand (for verification only)
jest.mock('@aws-sdk/client-ssm', () => {
  const original = jest.requireActual('@aws-sdk/client-ssm');
  return {
    ...original,
    GetParameterCommand: jest.fn()
  };
});

// 👇 Mock SSMClient.prototype.send directly
const sendMock = jest.fn();
SSMClient.prototype.send = sendMock;

describe('getWebhookUrl (AWS SDK v3)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return webhook URL from SSM', async () => {
    sendMock.mockResolvedValueOnce({
      Parameter: { Value: 'https://webhook.site/abc123' }
    });

    const url = await WebhookFetcher.getUrl();
    expect(url).toBe('https://webhook.site/abc123');
    expect(GetParameterCommand).toHaveBeenCalledWith({
      Name: 'WEBHOOK_PATH',
       WithDecryption: false
    });
  });

  it('should throw error if Parameter is missing', async () => {
  sendMock.mockResolvedValueOnce({ Parameter: {} });

  await expect(WebhookFetcher.getUrl()).rejects.toThrow("Could not fetch webhook URL");
});


  it('should throw error if SSM call fails', async () => {
    sendMock.mockRejectedValueOnce(new Error('Could not fetch webhook URL'));
await expect(WebhookFetcher.getUrl()).rejects.toThrow('Could not fetch webhook URL');
  });
});
