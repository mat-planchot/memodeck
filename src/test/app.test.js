const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)

let token, iduser, iddeck, idcard = null;

// only at the beginning
beforeAll(async () => {
    const createUser = await request.post('/api/v1/users')
        .send({
            username: "test",
            email: "test@test.fr",
            password:"password",
            confirm_password:"password"
        });
    console.log(createUser.body)
    const loginUser = await request.post('/api/v1/users/login')
        .send({
            email: "test@test.fr",
            password:"password"
        });
    token = loginUser.body.token;
    iduser = loginUser.body.iduser;
    const createDeck = await request.post('/api/v1/decks')
        .set('Authorization', `Bearer ${token}`)
        .send({
            deckname: "deck",
            fkuser: iduser
        });
    const getDeck = await request.get('/api/v1/decks/deckname/deck')
        .set('Authorization', `Bearer ${token}`);
    iddeck = getDeck.body.iddeck
    const createCard = await request.post('/api/v1/cards')
        .set('Authorization', `Bearer ${token}`)
        .send({
            front: "question",
            back: "answer",
            fkdeck: iddeck,
            reviewdate: null
        });
    const getCard = await request.post('/api/v1/cards/front')
        .set('Authorization', `Bearer ${token}`)
        .send({
            front: "question"
        });
    idcard = getCard.body.idcard
})

afterAll(async () => {
    const deleteCard = await request.delete('/api/v1/cards/id/'+idcard)
        .set('Authorization', `Bearer ${token}`);
        expect(deleteCard.status).toBe(200)
    const deleteDeck = await request.delete('/api/v1/decks/id/'+iddeck)
        .set('Authorization', `Bearer ${token}`);
        expect(deleteDeck.status).toBe(200)
})

/**
 * USERS
 */
describe ('/api/v1/users', () => {

    it('POST user login', async () => {
        const response = await request.post('/api/v1/users/login')
            .send({
                email: "test@test.fr",
                password:"password"
            })
        expect(response.status).toBe(200)
        expect(response.body.username).toBe('test')
        expect(response.body.email).toBe('test@test.fr')
        expect(response.body.role).toBe('Apprenant')
    })

    it('GET users', async () => {
        const response = await request.get('/api/v1/users')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
    })

    it('GET username', async () => {
        const response = await request.get('/api/v1/users/username/test')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.iduser).toBe(iduser)
        expect(response.body.username).toBe('test')
        expect(response.body.email).toBe('test@test.fr')
        expect(response.body.role).toBe('Apprenant')
    })

    it('GET id', async () => {
        const url = '/api/v1/users/id/'+iduser;
        const response = await request.get(url)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.iduser).toBe(iduser)
        expect(response.body.username).toBe('test')
        expect(response.body.email).toBe('test@test.fr')
        expect(response.body.role).toBe('Apprenant')
    })

    it('GET whoami', async () => {
        const response = await request.get('/api/v1/users/whoami')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.iduser).toBe(iduser)
        expect(response.body.username).toBe('test')
        expect(response.body.email).toBe('test@test.fr')
        expect(response.body.role).toBe('Apprenant')
    })
})

/**
 * DECKS
 */
describe ('/api/v1/decks', () => {

    it('GET deckname', async () => {
        const response = await request.get('/api/v1/decks/deckname/deck')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.iddeck).toBe(iddeck)
        expect(response.body.deckname).toBe('deck')
    })

    it('GET iddeck', async () => {
        const response = await request.get('/api/v1/decks/id/'+iddeck)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.iddeck).toBe(iddeck)
        expect(response.body.deckname).toBe('deck')
    })

    it('POST all cards from a deck of a user', async () => {
        const response = await request.get('/api/v1/decks/'+iddeck+'/user/'+iduser)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body[0].iddeck).toBe(iddeck)
        expect(response.body[0].deckname).toBe('deck')
        expect(response.body[0].idcard).toBe(idcard)
        expect(response.body[0].front).toBe('question')
        expect(response.body[0].back).toBe('answer')
        expect(response.body[0].frontmedia).toBe(null)
        expect(response.body[0].backmedia).toBe(null)
    })

    it('GET decks', async () => {
        const response = await request.get('/api/v1/decks')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
    })
})

/**
 * CARDS
 */
describe ('/api/v1/cards', () => {

    it('GET idcard', async () => {
        const response = await request.get('/api/v1/cards/id/'+idcard)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.idcard).toBe(idcard)
        expect(response.body.front).toBe('question')
        expect(response.body.back).toBe('answer')
        expect(response.body.frontmedia).toBe(null)
        expect(response.body.backmedia).toBe(null)
        expect(response.body.fkdeck).toBe(iddeck)
        expect(response.body.nbreview).toBe(1)
        expect(response.body.issuspended).toBe(0)
        expect(response.body.difficulty).toBe(1)
        expect(response.body.nbdayreview).toBe(1)
        //let date = new Date(response.body.reviewdate).toISOString().replace(/T.+/,'')
        //expect(date).toBe(new Date().toISOString().replace(/T.+/,''))
    })

    it('GET cards', async () => {
        const response = await request.get('/api/v1/cards')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
    })

    it('GET cards from iddeck', async () => {
        const response = await request.get('/api/v1/cards/deck/'+iddeck)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
    })

    it('POST cards by front', async () => {
        const response = await request.post('/api/v1/cards/front')
            .set('Authorization', `Bearer ${token}`)
            .send({
                front: "question"
            });
        expect(response.status).toBe(200)
        expect(response.body.idcard).toBe(idcard)
        expect(response.body.front).toBe('question')
        expect(response.body.back).toBe('answer')
        expect(response.body.frontmedia).toBe(null)
        expect(response.body.backmedia).toBe(null)
        expect(response.body.fkdeck).toBe(iddeck)
    })

    it('POST cards by back', async () => {
        const response = await request.post('/api/v1/cards/back')
            .set('Authorization', `Bearer ${token}`)
            .send({
                back: "answer"
            });
        expect(response.status).toBe(200)
        expect(response.body.idcard).toBe(idcard)
        expect(response.body.front).toBe('question')
        expect(response.body.back).toBe('answer')
        expect(response.body.frontmedia).toBe(null)
        expect(response.body.backmedia).toBe(null)
        expect(response.body.fkdeck).toBe(iddeck)
    })

    it('GET review cards', async () => {
        let idcardex = null
        const newCard = await request.post('/api/v1/cards')
            .set('Authorization', `Bearer ${token}`)
            .send({
                front: "example",
                back: "for now",
                fkdeck: iddeck,
                reviewdate: new Date().toISOString().replace(/T.+/,'')
            });
        expect(newCard.status).toBe(201)
        const getNewCard = await request.post('/api/v1/cards/front')
            .set('Authorization', `Bearer ${token}`)
            .send({
                front: "example"
            });
        idcardex = getNewCard.body.idcard
        const reviewCards = await request.get('/api/v1/cards/reviewcards/'+iddeck)
            .set('Authorization', `Bearer ${token}`);
        expect(reviewCards.status).toBe(200)
    
        // random review card but there is only one this day
        const reviewCard = await request.get('/api/v1/cards/reviewcard/'+iddeck)
            .set('Authorization', `Bearer ${token}`);
        expect(reviewCard.status).toBe(200)
        expect(reviewCard.body.idcard).toBe(idcardex)

        const deleteCard = await request.delete('/api/v1/cards/id/'+idcardex)
            .set('Authorization', `Bearer ${token}`);
        expect(deleteCard.status).toBe(200)
    })

    it('PATCH update review date', async () => {
        const getCard = await request.post('/api/v1/cards/front')
            .set('Authorization', `Bearer ${token}`)
            .send({
                front: "question"
            });
        let nbreview = getCard.body.nbreview + 1;
        let difficulty = getCard.body.nbdayreview + 0.25;
        let nbdayreview = Math.round(getCard.body.nbdayreview * difficulty);
        const updateReviewDate = await request.patch('/api/v1/cards/dayreview/'+idcard)
            .set('Authorization', `Bearer ${token}`)
            .send({
                nbdayreview: nbdayreview,
                nbreview: nbreview,
                difficulty: difficulty
            });
        expect(updateReviewDate.status).toBe(200)
        const getCardGood = await request.post('/api/v1/cards/front')
            .set('Authorization', `Bearer ${token}`)
            .send({
                front: "question"
            });
        expect(getCardGood.status).toBe(200)
        expect(getCardGood.body.nbdayreview).toBe(nbdayreview)
        expect(getCardGood.body.difficulty).toBe(difficulty)
        expect(getCardGood.body.nbreview).toBe(nbreview)
        let date = new Date(getCardGood.body.reviewdate).toISOString().replace(/T.+/,'')
        expect(date).toBe(new Date().toISOString().replace(/T.+/,''))
    })
})
