const router = require("express").Router();
const db = require("../data/dbConfig.js");

router.get("/", (req, res) => {
    db.select("*")
        .from("accounts")
        .then(accounts => {
            res.status(200).json(accounts);
        })
        .catch(() => {
            res.status(500).json({
                error: "Server error"
            });
        });
});

router.get("/:id", (req, res) => {
    db.select("*")
        .from("accounts")
        .where({
            id: req.params.id
        })
        .first()
        .then(account => {
            res.status(200).json(account);
        });
});

router.post("/", validateName, checkNumber, (req, res) => {
    const {
        budget,
        name
    } = req.body;
    db.insert({
            name: name,
            budget: Number(budget)
        }, "id")
        .into("accounts")
        .then(records => {
            res.status(201).json(records);
        });
});

router.put("/:id", (req, res) => {
    const changes = req.body;
    db("accounts")
        .where({
            id: req.params.id
        })
        .update(changes)
        .then(count => {
            res.status(200).json(count);
        })
        .catch(() => {
            res.status(500).json({
                error: "Failed to update post"
            });
        });
});

router.delete("/:id", (req, res) => {
    db("accounts")
        .where({
            id: req.params.id
        })
        .del()
        .then(count => {
            res.status(200).json(count);
        });
});

function checkNumber(req, res, next) {
    const {
        budget
    } = req.body;
    isNaN(parseInt(budget)) ?
        res.status(400).json({
            err: "Budget must be a number"
        }) :
        next();
}

function validateName(req, res, next) {
    db.select("*")
        .from("accounts")
        .where({
            name: req.body.name
        })
        .first()
        .then(({
            name
        }) => {
            name === req.body.name ?
                res.status(400).json({
                    err: "name must be unique"
                }) :
                null;
        });
    next();
}

module.exports = router;
