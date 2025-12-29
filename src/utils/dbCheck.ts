import mongoose from 'mongoose';

export const checkDatabaseConnection = () => {
    const state = mongoose.connection.readyState;

    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',

    };

    return {
        status: states[state as keyof typeof states] || 'unknown',
        stateCode: state,
    };
};
