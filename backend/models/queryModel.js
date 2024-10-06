import mongoose from "mongoose";

const querySchema = mongoose.Schema(
    {
        conversationHistory: [
            {
                user: {
                    type: String,
                    required: true
                },
                bot: {
                    type: String,
                    required: true
                }
            }
        ],
        userQuestion: {
            type: String,
            required: true
        },
        BotAnswer: {
            type: String,
            required: true
        },
        context: {
            type: Map, // Using Map allows for a flexible key-value pair structure
            of: String,
            required: true
        },
    },
    {
        timestamps: true
    });
    
export const QueryLog = mongoose.model('Query', querySchema);