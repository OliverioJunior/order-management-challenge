import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/order-management';

        await mongoose.connect(mongoURI);

        console.log('✅ MongoDB conectado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao conectar ao MongoDB:', error);
        process.exit(1);
    }
};

// Event listeners para monitorar a conexão


mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Erro na conexão do MongoDB:', err);
});

export default connectDB;
