import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function localApiPlugin() {
  return {
    name: 'local-api-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/call' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const { phoneNumber, customerName, product } = parsed;
              const blandKey = parsed.apiKey || 'org_e8071833b8e2ddf669c4118ba7979becf34952801063e6b4c286551868aecb67df14052eaad805850cf369';

              const response = await fetch('https://api.bland.ai/v1/calls', {
                method: 'POST',
                headers: {
                  'Authorization': blandKey,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  phone_number: phoneNumber,
                  task: `You are Avani, frontline sales pitch coach and consultant at On-Ground.ai calling regarding the ${product || 'Ortho GRID Pro mattress'}. Greet ${customerName || 'the customer'} warmly by their name. Mention you are following up on their retail store mattress enquiry. Explain our patented Japanese SmartGRID with 2,500 air channels for back pain relief. Offer our 6-month zero-cost EMI (₹7,000/mo) and 100-night trial. Be polite, warm, and natural.`,
                  voice: 'june',
                  reduce_latency: true
                })
              });

              const data = await response.json();
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = response.status;
              if (!response.ok) {
                res.end(JSON.stringify({
                  success: false,
                  error: data.message || data.error || 'Failed to place call via Bland AI',
                  ...data
                }));
              } else {
                res.end(JSON.stringify({
                  success: true,
                  provider: 'Bland AI',
                  callId: data.call_id || data.id,
                  status: 'ringing',
                  message: `Call placed successfully to ${phoneNumber}!`,
                  ...data
                }));
              }
            } catch (err) {
              console.error('Local call error:', err);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), localApiPlugin()],
  server: {
    port: 3000,
    open: false
  }
})
