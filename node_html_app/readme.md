To start the app without docker:

```bash
cd ./node_html_app
npm install
npm start
```

To start the app in container:

```bash
cd ./node_html_app

# must have . which is the context
docker build .

# have localhost 3000 wired to container's port 80
# image_id doesn't have to be full, just need the first few letters to uniquely identify
docker run -p 3000:80 <IMAGE_ID>
```
