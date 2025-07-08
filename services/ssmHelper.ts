import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

export class WebhookFetcher {
  private static client = new SSMClient({ region: "ap-south-1" });

  static async getUrl(): Promise<string> {
    try {
      const command = new GetParameterCommand({
        Name: "WEBHOOK_PATH",
        WithDecryption: false
      });

      const response = await this.client.send(command);

      if (!response.Parameter?.Value) {
        throw new Error("WEBHOOK_PATH is missing or empty");
      }

      return response.Parameter.Value;
    } catch (error) {
      console.error("Error fetching WEBHOOK_PATH:", error);
      throw new Error("Could not fetch webhook URL");
    }
  }
}
  
  
  