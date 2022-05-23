const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const multer = require("multer");
const { Web3Storage, File } = require('web3.storage');
dotenv.config()

const storage= multer.memoryStorage();
const upload = multer({storage: storage});


router.post("/save", upload.none(), async(req,res,next) => {
    try{
        const {name, description, info} = req.body;
        let web3Storage = new Web3Storage({token: process.env.WEB3STORAGE_TOKEN})
        let file = {
            name: name,
            description: description,
            info: info
        }
        const buffer = Buffer.from(JSON.stringify(file));
        const files = [
            new File([buffer], `${name}.json`)
        ]
        const cid = await web3Storage.put(files);
        res.status(200).json({
            statusCode:200, 
            cid: cid, 
            link:`ipfs://${cid}`,
            link2:`${cid}.ipfs.dweb.link/${name}.json`
        })
    }
    catch(e){
        res.status(500).send({
            statusCode:500,
            error:e.message
        })
    }
})

router.get("/", async(req,res,next) => {
    try{
        let web3Storage = new Web3Storage({token: process.env.WEB3STORAGE_TOKEN})
        const files = await web3Storage.get("bafybeiasknuec2kvkjd3byxi4qj5txorb3pktfmynptugw6sssnxmu2iqy");
        console.log(`Got a response! [${files.status}] ${files.statusText}`)

        // const filess = await files.files()
        // for (const file of filess) {
        //   console.log(`${file.cid} -- ${file.path} -- ${file.size}`)
        // }
        console.log(web3Storage.list())
        for await (const upload of web3Storage.list()) {
            console.log(`${upload.name} - cid: ${upload.cid} - size: ${upload.dagSize}`)
          }
        res.status(200).json({statusCode:200})
        
    }
    catch(e){
        res.status(500).send({
            statusCode:500,
            error:e.message
        })
    }
})

module.exports = router;