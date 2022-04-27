import express from "express";
import { nanoid } from "nanoid";
import lodash from "lodash";
const router = express.Router();

const idLength = 8;

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the book
 *         title:
 *           type: string
 *           description: Title of the book
 *         author:
 *           type: string
 *           description: Author of the book
 *       example:
 *         id: "5e9b8f8f-c8e0-4b3b-b8b8-f8f8f8f8f8f8"
 *         title: "The Hobbit"
 *         author: "J.R.R. Tolkien"
 *
 */

/**
 * @swagger
 * tags:
 *  name: Books
 *  description: Books management
 *
 */
/**
 * @swagger
 * /books:
 *    get:
 *      description: Returns all books
 *      responses:
 *        200:
 *          description: An array of books
 *          content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *
 */

router.get("/", (req, res) => {
  const books = req.app.db.chain.get("books").value();

  res.send(books);
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *    description: Returns a single book
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Unique identifier of the book
 *        required: true
 *        schema:
 *        type: string
 *    responses:
 *      200:
 *       description: A single book
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 */

router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  const id = parseInt(req.params.id);
  const book = await req.app.db.chain.get("books").find({ id }).value();

  res.status(200).json(book);
});

router.post("/", (req, res) => {
  try {
    const newBook = req.body;
    newBook.id = nanoid(idLength);

    req.app.db.chain.get("books").push(newBook).write();

    res.send(newBook);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put("/:id", (req, res) => {
  try {
    const book = req.body;
    book.id = req.params.id;
    req.app.db.chain
      .get("books")
      .find({ id: req.params.id })
      .assign(book)
      .write();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete("/:id", (req, res) => {
  try {
    req.app.db.chain.get("books").remove({ id: req.params.id }).write();
  } catch (error) {
    res.status(500).send(error.message);
  }
});
export default router;
