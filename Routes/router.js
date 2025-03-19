const express=require('express')
const keyandanswer=require('../Controller/keyandanswer')
const questions=require('../Controller/questions')
const router=new express.Router()
// register
router.post('/ask',keyandanswer.keyandanswercontroller)
router.get('/questions',questions.getQuestions)

module.exports=router