new Vue ({
    el : '#filesys',
    data() {
        return {
            message : "",
            dir : "",
            file : "",
            split_line : '<HR style="FILTER: alpha(opacity=100,finishopacity=0,style=3)" width="90%" color=grey SIZE=3>',
            loaded : false
        }
    },
    mounted() {
        let path = getQueryVariable("path");
        if (!path) path = 'root'
        // history.replaceState({}, "F:/Coding/Front/index.html", "F:/Coding/Front/index.html")
        axios.get('http://localhost:8080/test?path=' + path)
        .then(res => {
            if (res.data.directory == null && res.data.file == null) {
                this.message = "什么都没有啊这里";
            }
            else {
                if (path != "root") {
                        let upperDir = path.split('/')[0];
                        this.dir = 
                        `<div class="card-item">
                            <a href="F:/Coding/Front/index.html?path=${upperDir}">
                                <img draggable=false src="https://img.icons8.com/bubbles/200/000000/opened-folder.png"/>
                            </a>
                        <span class="item-name">返回上层</span></div>`
                }

                if (res.data.directory) {
                    for (let dir of res.data.directory) {
                    this.dir += 
                        `<div class="card-item">
                            <a href="F:/Coding/Front/index.html?path=${path}/${dir}">
                                <img draggable=false src="https://img.icons8.com/bubbles/200/000000/folder-invoices.png"/>
                            </a>
                        <span class="item-name">${dir}</span></div>`
                    }
                }

                if (res.data.file) {
                    for (let file of res.data.file) {
                        let img_src = 'https://img.icons8.com/bubbles/200/000000/news.png';
                        if (/\.srt$/i.test(file)) img_src = 'https://img.icons8.com/bubbles/200/000000/speech-bubble.png';
                        else if (/\.mp3/i.test(file)) img_src = 'https://img.icons8.com/bubbles/200/000000/music.png';
                        else if (/\.mp4/i.test(file)) img_src = 'https://img.icons8.com/bubbles/200/000000/play.png';
                        this.file += 
                            `<div class="card-item">
                                <a href="F:/Coding/Front/index.html?path=${file}">
                                    <img draggable=false src="${img_src}"/>
                                </a>
                            <span class="item-name">${file}</span></div>`
                    }
                } else this.split_line = "";
                this.loaded = true;
            }
        })                                
        .catch(err => this.message = err);
    }
});