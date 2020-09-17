const express = require('express');
const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const accounts = await db('accounts');
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: 'error getting accounts', error: err });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [account] = await db('accounts').where({ id });
        if (account) {
            res.json(account);
        } else {
            res.status(404).json({ message: 'invalid id' });
        }
    } catch (err) {
        res.status(500).json({ message: 'could not retrieve record from database', error: err });
    }
});

router.post('/', async (req, res) => {
    const account = req.body;
    try {
        await db('accounts').insert(account);
        res.status(201).json({ insert: account });
    } catch (err) {
        res.status(500).json({ message: 'error posting record to database', error: err });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    try {
        const count = await db('accounts').update(changes).where({ id });
        if (count) {
            res.json({ updated: count });
        } else {
            res.status(404).json({ message: 'invalid id' });
        }
    } catch (err) {
        res.status(500).json({ message: 'error updating record', error: err });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const count = await db('accounts').where({ id }).del();
        if (count) {
            res.json({ deleted: count });
        } else {
            res.status(404).json({ message: 'invalid id' });
        }
    } catch (err) {
        res.status(500).json({ message: 'error deleting record', error: err });
    }
});

module.exports = router;