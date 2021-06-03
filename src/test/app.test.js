const app = require('../app')
const supertest = require('supertest')
const auth = require('../middleware/auth.middleware')
const request = supertest(app)

let token, iduser, iddeck, idcard, idreviewcard = null;

// only at the beginning
beforeAll(async () => {
    let res = null
    // is this user created?
    res = await request.post('/api/v1/users/login')
        .send({
            email: "test@test.fr",
            password:"password"
        });
    // no we create it
    if (res.status !== 200) {
        res = await request.post('/api/v1/users')
            .send({
                username: "test",
                email: "test@test.fr",
                password:"password",
                confirm_password:"password"
            });
        expect(res.status).toBe(201)
        expect(res.body.message).toBe('User was created!')
        // we want the token
        res = await request.post('/api/v1/users/login')
            .send({
                email: "test@test.fr",
                password:"password"
            });
        token = res.body.token;
        iduser = res.body.iduser;
    }
    // user is created, we get the token
    token = res.body.token;
    iduser = res.body.iduser;
    res = await request.get('/api/v1/decks/deckname/deck')
        .set('Authorization', `Bearer ${token}`);
    if (res.status !== 200) { // deck does not exist, we create it
        res = await request.post('/api/v1/decks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                deckname: "deck",
                fkuser: iduser
            });
        expect(res.status).toBe(201)
        expect(res.body.message).toBe('Deck was created!')
        res = await request.get('/api/v1/decks/deckname/deck')
            .set('Authorization', `Bearer ${token}`);
        iddeck = res.body.iddeck
    }
    iddeck = res.body.iddeck
    res = await request.post('/api/v1/cards/front')
        .set('Authorization', `Bearer ${token}`)
        .send({
            front: "question"
        });
    if (res.status !== 200) { // card does not exist, we create it
        res = await request.post('/api/v1/cards')
            .set('Authorization', `Bearer ${token}`)
            .send({
                front: "question",
                back: "answer",
                fkdeck: iddeck
            });
        expect(res.status).toBe(201)
        expect(res.body.message).toBe('Card was created!')
        res = await request.post('/api/v1/cards/front')
            .set('Authorization', `Bearer ${token}`)
            .send({
                front: "question"
            });
        idcard = res.body.idcard
    }
    idcard = res.body.idcard
    res = await request.get('/api/v1/reviewcards')
        .set('Authorization', `Bearer ${token}`)
    if (res.status !== 200) { // reviewcard does not exist, we create it
        res = await request.post('/api/v1/reviewcards')
            .set('Authorization', `Bearer ${token}`)
            .send({
                reviewdate: new Date().toISOString().replace(/T.+/,''),
                fkcard: idcard
            });
        expect(res.status).toBe(201)
        idreviewcard = 1
    } else {
        const response = await request.get('/api/v1/reviewcards/idcard/'+idcard)
            .set('Authorization', `Bearer ${token}`)
        idreviewcard = response.body.idreviewcard
    }
})

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

    it('GET decks', async () => {
        const response = await request.get('/api/v1/decks')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
    })
})

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
        let response, idcardex = null
        response = await request.post('/api/v1/cards/front')
            .set('Authorization', `Bearer ${token}`)
            .send({
                front: "example"
            });
        if (response.status != 200) {
            response = await request.post('/api/v1/cards')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    front: "example",
                    back: "for now",
                    fkdeck: iddeck
                });
            expect(response.status).toBe(201)
            response = await request.post('/api/v1/cards/front')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    front: "example"
                });
            idcardex = response.body.idcard
        }
        idcardex = response.body.idcard
        response = await request.get('/api/v1/reviewcards/idcard/'+idcardex)
            .set('Authorization', `Bearer ${token}`)
        if (response.status != 200) {
            response = await request.post('/api/v1/reviewcards')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    reviewdate: new Date().toISOString().replace(/T.+/,''),
                    fkcard: idcardex
                });
            expect(response.status).toBe(201)
        }
        response = await request.post('/api/v1/cards/reviewcards')
            .set('Authorization', `Bearer ${token}`)
            .send({
                fkdeck: iddeck
            });
        expect(response.status).toBe(200)
    
        // random review card but there is only one this day
        response = await request.post('/api/v1/cards/reviewcard')
            .set('Authorization', `Bearer ${token}`)
            .send({
                fkdeck: iddeck
            });
        expect(response.status).toBe(200)
        expect(response.body.fkcard).toBe(idcardex)
    })
})

describe ('/api/v1/reviewcards', () => {
    it('GET review cards', async () => {
        const response = await request.get('/api/v1/reviewcards')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
    })

    it('UPDATE review card', async () => {
        const date = new Date().toISOString().replace(/T.+/,'')
        const response = await request.patch('/api/v1/reviewcards/id/'+idreviewcard)
            .set('Authorization', `Bearer ${token}`)
            .send({
                nbdayreview: 1
            });
        expect(response.status).toBe(200)
    })

    it('GET review card by id', async () => {
        const response = await request.get('/api/v1/reviewcards/id/'+idreviewcard)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.idreviewcard).toBe(idreviewcard)
        expect(response.body.nbreview).toBe(1)
        expect(response.body.issuspended).toBe(0)
        expect(response.body.difficulty).toBe(1)
        expect(response.body.nbdayreview).toBe(1)
        expect(response.body.fkcard).toBe(idcard)
        let date = new Date(response.body.reviewdate).toISOString().replace(/T.+/,'')
        expect(date).toBe(new Date().toISOString().replace(/T.+/,''))
    })

    it('GET review card by id', async () => {
        const response = await request.get('/api/v1/reviewcards/idcard/'+idcard)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.idreviewcard).toBe(idreviewcard)
        expect(response.body.nbreview).toBe(1)
        expect(response.body.issuspended).toBe(0)
        expect(response.body.difficulty).toBe(1)
        expect(response.body.nbdayreview).toBe(1)
        expect(response.body.fkcard).toBe(idcard)
        let date = new Date(response.body.reviewdate).toISOString().replace(/T.+/,'')
        expect(date).toBe(new Date().toISOString().replace(/T.+/,''))
    })
})