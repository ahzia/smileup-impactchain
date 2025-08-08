const { Client, AccountId, PrivateKey } = require("@hashgraph/sdk");
require("dotenv").config({ path: '.env.local' });

async function testHCSService() {
  try {
    console.log("🧪 Testing HCS Service...");

    // Validate environment
    const required = ['HEDERA_OPERATOR_ID', 'HEDERA_OPERATOR_PRIVATE_KEY', 'HEDERA_NETWORK'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:');
      missing.forEach(key => console.error(`  - ${key}`));
      process.exit(1);
    }

    // Initialize client
    const operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_PRIVATE_KEY);
    const network = process.env.HEDERA_NETWORK;
    
    const client = network === 'mainnet' 
      ? Client.forMainnet() 
      : Client.forTestnet();
    
    client.setOperator(operatorId, operatorKey);

    console.log("✅ Environment validated");
    console.log(`📊 Account ID: ${operatorId.toString()}`);
    console.log(`🌐 Network: ${network}`);

    // Test HCS topic creation
    console.log("\n🏗️ Testing HCS topic creation...");
    
    const { TopicCreateTransaction } = require('@hashgraph/sdk');
    
    // Create a test topic
    const topicTx = new TopicCreateTransaction()
      .setTopicMemo("SmileUp Test Topic")
      .setAdminKey(operatorKey.publicKey)
      .setSubmitKey(operatorKey.publicKey);

    const topicResponse = await topicTx.execute(client);
    const topicReceipt = await topicResponse.getReceipt(client);
    const topicId = topicReceipt.topicId;

    console.log(`✅ Test topic created: ${topicId}`);

    // Test message submission
    console.log("\n📝 Testing message submission...");
    
    const { TopicMessageSubmitTransaction } = require('@hashgraph/sdk');
    
    const testMessage = JSON.stringify({
      type: "test_message",
      data: {
        userId: "test-user-123",
        action: "test_action",
        timestamp: new Date().toISOString()
      }
    });

    const messageTx = new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(testMessage);

    const messageResponse = await messageTx.execute(client);
    const messageReceipt = await messageResponse.getReceipt(client);

    console.log(`✅ Message submitted successfully`);
    console.log(`📊 Transaction ID: ${messageResponse.transactionId}`);

    // Test topic info query
    console.log("\n🔍 Testing topic info query...");
    
    const { TopicInfoQuery } = require('@hashgraph/sdk');
    
    const topicInfoQuery = new TopicInfoQuery()
      .setTopicId(topicId);

    const topicInfo = await topicInfoQuery.execute(client);
    
    console.log(`✅ Topic info retrieved`);
    console.log(`📊 Topic ID: ${topicInfo.topicId}`);
    console.log(`📝 Topic Memo: ${topicInfo.topicMemo}`);
    console.log(`👤 Admin Key: ${topicInfo.adminKey}`);
    console.log(`📤 Submit Key: ${topicInfo.submitKey}`);

    console.log("\n✅ HCS service test completed successfully!");
    console.log("📊 Summary:");
    console.log(`   Topic Created: ${topicId}`);
    console.log(`   Message Submitted: ✅`);
    console.log(`   Topic Info Retrieved: ✅`);

  } catch (error) {
    console.error("❌ Error testing HCS service:", error);
    
    if (error.message.includes('INSUFFICIENT_PAYER_BALANCE')) {
      console.error('\n💡 Solution: Add more HBAR to your account');
    } else if (error.message.includes('INVALID_ACCOUNT_ID')) {
      console.error('\n💡 Solution: Check your HEDERA_OPERATOR_ID format');
    }
    
    process.exit(1);
  }
}

testHCSService(); 