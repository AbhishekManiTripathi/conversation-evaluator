// routes for query model
import express from 'express'
import { QueryLog } from '../models/queryModel.js';
import { evaluateWithOpenAI } from './aiUtils.js';


const router = express.Router();


// create a querylog object in DB
router.post('/', async (req, res) => {
    try {
        // Check if any required field is missing
        if (!req.body.conversationHistory || 
            !req.body.userQuestion || 
            !req.body.BotAnswer || 
            !req.body.context // Corrected this check
            ) {
                return res.status(400).send({ 
                    message: 'One of the mandatory fields is missing: History, Question, Answer, or Context' 
                });
        }

        // Create the new query log object
        const newQueryLog = {
            conversationHistory: req.body.conversationHistory,
            userQuestion: req.body.userQuestion,
            BotAnswer:  req.body.BotAnswer,
            context: req.body.context
        };

        // Insert into the database
        const query = await QueryLog.create(newQueryLog);

        // Respond with the created record
        return res.status(201).send(query);

    } catch (error) {
        console.log(error.message);
        // Use 'res' consistently here as well
        return res.status(500).send({message: error.message}); 
    }
});

// get all query logs
router.get('/', async (req, res) => {
    try {
        const querylogs = await QueryLog.find({});
        return res.status(200).json({
            count: querylogs.length,
            data: querylogs,
            
        })
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message:error.message})
    }
    
});

// get query logs by id 
router.get('/:id', async (req, res) => {
    try {

        const { id } = req.params;
        const querylog = await QueryLog.findById(id);
        return res.status(200).json(querylog)
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message:error.message})
    }
    
});

// update one query log
router.put('/:id', async (req, resp) => {
    try {
        if (!req.body.conversationHistory || 
            !req.body.userQuestion || 
            !req.body.BotAnswer || 
            !req.body.context // Corrected this check
            ) {
                return resp.status(400).send({ 
                    message: 'One of the mandatory fields is missing: History, Question, Answer, or Context' 
                });
        }

        const { id } = req.params;
        const result = await QueryLog.findByIdAndUpdate(id, req.body);
        return resp.status(200).send({ message: 'query log updated successfully' });
       
    } catch (error) {
        console.log(error.message);
        return resp.status(500).send({ message: error.message });
    }
});

router.delete('/:id', async (req, resp) => {
    try {
        const { id } = req.params;
        const result = await QueryLog.findByIdAndDelete(id);
        if(!result)
        {
            return resp.status(404).json({message: 'Querylog not found'});

        }

        return resp.status(200).send({message: 'Querylog deleted successfully'})
    } catch (error) {
        
    }
});

export default router;

// post evaluate id
router.post('/evaluate/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { metrics } = req.body;
    
        // Fetch query log from DB by ID
        const queryLog = await QueryLog.findById(id);
        if (!queryLog) {
          return res.status(404).json({ error: 'Query log not found' });
        }
    
        // Evaluate the selected metrics using OpenAI
        const evaluationResults = await evaluateWithOpenAI(queryLog, metrics);
    
        // Return the evaluation results
        res.json({ evaluationResults });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during evaluation' });
      }
    });
    
//evaluate get by id
router.get('/evaluate/:id', async (req, res) => {
    try {

        const { id } = req.params;
        const querylog = await QueryLog.findById(id);
        return res.status(200).json(querylog)
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message:error.message})
    }
    
});