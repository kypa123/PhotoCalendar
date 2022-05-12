const { article } = require('../../db');
const axios = require('axios');
const qs = require('qs');
const jwt = require('jsonwebtoken');
const kakaoClientID = '904d1d2aa96e5c26e05b03905933ef87';
const kakaoClientSecret = 'rzK8inmejYty3s16HLr8QuuExuUqsP0H';
const redirectUri = 'http://localhost:5030/auth/kakao/callback';
const { mainPage } = require('../../db');

let now = Date.now();

const output = {
    home: (req, res) => {
        let d = req.params.d;
        let d1 = 0;
        if (Number(d[d.length - 1]) === 1) {
            d1 = 12;
        } else {
            d1 = Number(d[d.length - 1]) + 1;
        }
        console.log(d.slice(0, 4) + '-' + d1.toString());
        const start = new Date(d);
        const end = new Date(d.slice(0, 4) + '-' + d1.toString());

        console.log(start);
        console.log(end);
        article.find({ date: { $gte: start, $lt: end } }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                res.json(data);
            }
        });
    },
    kakao: async (req, res) => {
        let token;
        try {
            token = await axios({
                method: 'POST',
                url: 'https://kauth.kakao.com/oauth/token',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                data: qs.stringify({
                    grant_type: 'authorization_code',
                    client_id: kakaoClientID,
                    client_secret: kakaoClientSecret,
                    redirectUri: redirectUri,
                    code: req.query.code,
                }),
            });
        } catch (err) {
            res.json(err.data);
        }
        let user;
        try {
            user = await axios({
                method: 'GET',
                url: 'https://kapi.kakao.com/v2/user/me',
                headers: {
                    Authorization: `Bearer ${token.data.access_token}`,
                },
            });
        } catch (err) {
            res.json(err.data);
        }
        const jwttoken = jwt.sign(
            {
                id: token.data.id,
            },
            process.env.JWT_SECRET,
            {
                issuer: 'snail',
            }
        );
        console.log(token);
        console.log(user);
        console.log(jwttoken);
        res.send('ok');
    },
    login: (req, res, next) => {
        res.json('mainpagedata');
        console.log(typeof req.params.id);
        next();
    },
    input: (req, res) => {
        res.send('/detail page');
    },
    profile: (req, res) => {
        res.send('/profile page');
    },
    like: (req, res) => {
        article.find({ like: true }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                res.json(data);
            }
        });
    },
    detailGet: (req, res) => {
        const inputDate = req.params.date;
        const nextDate = (parseInt(inputDate) + 1).toString();

        const fixedDate =
            inputDate.slice(0, 4) +
            '-' +
            inputDate.slice(4, 6) +
            '-' +
            inputDate.slice(6, 8);
        const fixedNext =
            nextDate.slice(0, 4) +
            '-' +
            nextDate.slice(4, 6) +
            '-' +
            nextDate.slice(6, 8);

        const inputId = req.params.idToken;
        datetag = new Date(fixedDate);
        dateend = new Date(fixedNext);

        article.find(
            { id_token: inputId, date: { $gte: datetag, $lt: dateend } },
            (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(data);
                }
            }
        );
    },
    detailPost: (req, res) => {
        const { id_token, date, title, content, imgurl, like } = req.body;
        const parsedDate =
            date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8);
        const datetag = new Date(parsedDate);
        let atc = new article({
            id_token,
            date: datetag,
            title,
            content,
            imgurl,
            like,
        });
        atc.save().then((newPost) => {
            console.log('create 완료!');
            res.json({
                message: 'Create Success!',
                data: {
                    post: newPost,
                },
            });
        });
    },
    detailDelete: async (req, res, next) => {
        const post_id = req.params.post_id; //_id로 삭제할겁니다. 고유값이니까
        article
            .deleteOne({ _id: post_id })
            .then((output) => {
                if (output.n == 0)
                    return res.status(404).json({ message: 'post not found' });
                console.log('Delete 완료');
                res.status(200).json({
                    message: 'Delete Success',
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: err,
                });
            });
    },

    detailUpdate: async (req, res) => {
        const post_id = req.params.post_id;
        const { title, content, like } = req.body;
        try {
            let post = await article.findById(post_id);
            if (!post)
                return res.status(404).json({ message: '해당 글이 없습니다' });
            post.title = title;
            post.content = content;
            post.like = like;
            var output = await post.save();
            console.log('업데이트 완료!');
            res.status(200).json({
                message: 'Update success',
                data: {
                    post: output,
                },
            });
        } catch (err) {
            res.status(500).json({
                message: err,
            });
        }
    },
};

module.exports = {
    output,
};
