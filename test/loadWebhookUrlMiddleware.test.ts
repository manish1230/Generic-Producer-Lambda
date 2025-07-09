import { loadWebhookUrlMiddleware } from '../middlewares/loadWebhook';
import { WebhookFetcher } from '../services/ssmHelper';
import { logger } from '../utils/logger';

jest.mock('../services/ssmHelper');
jest.mock('../utils/logger');

const mockedGetUrl = WebhookFetcher.getUrl as jest.Mock;

describe('loadWebhookUrlMiddleware', () => {
   const originalModule = jest.requireActual('../middlewares/loadWebhook');

    let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    (originalModule as any).webhookPath = '';
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should fetch and attach webhookPath on first call', async () => {
    mockedGetUrl.mockResolvedValueOnce('https://webhook.site/test');

    await loadWebhookUrlMiddleware(req, res, next);

    expect(mockedGetUrl).toHaveBeenCalled();
    expect(req.webhookPath).toBe('https://webhook.site/test');
    expect(next).toHaveBeenCalled();
  });

})
