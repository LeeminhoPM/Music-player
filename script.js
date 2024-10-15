// Mobile menu
const menuOpen = document.getElementById('menu-open');
const menuClose = document.getElementById('menu-close');
const sidebar = document.querySelector('.container .sidebar');

menuOpen.addEventListener('click', () =>{
    sidebar.style.left = '0';
});

menuClose.addEventListener('click', () =>{
    sidebar.style.left = '-100%';
});

// Main Logic
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Không thuộc về tao'; 

const playlists = $$('.playlist .music-list .items');
const cd = $('.container .right-section .music-player .song-info img');
const songName = $('.container .right-section .music-player .description h3');
const artistName = $('.container .right-section .music-player .description h5');
const playlistTitle = $('.container .right-section .music-player .description p');
const songTimer = $('#current-song-lenght');
const songDuration = $('#song-duration');
const cdThumb = $('.container .right-section .music-player .song-info img');
const audio = $('#audio');
const playBtn = $('.container .right-section .music-player .player-actions .buttons .play-button');
const progressLine = $('.container .right-section .music-player .song-info .progress .progress-line');
const active = $('.container .right-section .music-player .song-info .progress .active-line');
const deactive = $('.container .right-section .music-player .song-info .progress .deactive-line');
const nextBtn = $('.next-song');
const preBtn = $('.previous-song');
const randomBtn = $('.random-song');
const repeatBtn = $('.repeat-song');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Bad Blood',
            singer: 'Taylor Swift',
            image: './images/1989.jpg',
            path: './soundtracks/TaylorSwift_BadBlood.mp3',
            length: '03:20'
        },
        {
            name: 'Blank Space',
            singer: 'Taylor Swift',
            image: './images/1989.jpg',
            path: './soundtracks/TaylorSwift_BlankSpace.mp3',
            length: '04:32'
        },
        {
            name: 'Cruel Summer',
            singer: 'Taylor Swift',
            image: './images/Lover.jpg',
            path: './soundtracks/TaylorSwift_CruelSummer.mp3',
            length: '02:58'
        },
        {
            name: 'Enchanted',
            singer: 'Taylor Swift',
            image: './images/SpeakNow.jpg',
            path: './soundtracks/TaylorSwift_Enchanted.mp3',
            length: '05:53'
        },
        {
            name: 'Love Story',
            singer: 'Taylor Swift',
            image: './images/Fearless.jpg',
            path: './soundtracks/TaylorSwift_LoveStory.mp3',
            length: '03:57'
        },
        {
            name: 'Shake It Off',
            singer: 'Taylor Swift',
            image: './images/1989.jpg',
            path: './soundtracks/TaylorSwift_ShakeItOff.mp3',
            length: '04:02'
        },
        {
            name: 'Wildest Dream',
            singer: 'Taylor Swift',
            image: './images/1989.jpg',
            path: './soundtracks/TaylorSwift_WildestDream.mp3',
            length: '03:40'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `<div class="item ${index === this.currentIndex ? 'current-play' : ''}">
            <div class="info">
                <p>01</p>
                <img src="${song.image}" alt="">
                <div class="details">
                    <h5>${song.name}</h5>
                    <p>${song.singer}</p>
                </div>
            </div>

            <div class="actions">
                <p>${song.length}</p>
                <div class="waveContainer">
                    <div class="wave wave1"></div>
                    <div class="wave wave2"></div>
                    <div class="wave wave3"></div>
                    <div class="wave wave4"></div>
                    <div class="wave wave5"></div>
                </div>
                <div class="icon" data-index="${index}">
                    <i class='bx bxs-right-arrow'></i>
                </div>
                <i class='bx bx-dots-horizontal-rounded'></i>
            </div>
        </div>`
        });

        playlists.forEach(playlist => {
            playlist.innerHTML = htmls.join('');
        });
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function() {
        // Xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to thu nhỏ CD
        if (window.innerWidth <= '768') {
            const navbarHeight = $('.container main').offsetHeight;
            const profileHeight = $('.container .right-section .profile').offsetHeight;
            const cdWidth = cd.offsetWidth;

            document.onscroll = function() {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                if (scrollTop > navbarHeight + profileHeight) {
                    const newCdWidth = cdWidth - scrollTop + navbarHeight + profileHeight;
                    cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                    cd.style.height = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                    cd.style.opacity = newCdWidth / cdWidth;
                }
            } 
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if (!app.isPlaying) {
                audio.play();
            }
            else {
                audio.pause();
            }
        }

        audio.onplay = function() {
            app.isPlaying = true;
            playBtn.classList.remove('bxs-right-arrow');
            playBtn.classList.add('bx-pause');
            cdThumbAnimate.play();
        }

        audio.onpause = function() {
            app.isPlaying = false;
            playBtn.classList.add('bxs-right-arrow');
            playBtn.classList.remove('bx-pause');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progress = audio.currentTime / audio.duration * 100;
                active.style.width = progress + '%';
                deactive.style.width = (100 - progress) + '%';
            }

            const minutes = Math.floor(audio.currentTime / 60); 
            const seconds = Math.floor(audio.currentTime % 60);

            songTimer.innerHTML = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }

        // Tua nhanh nhạc (Music forward)
        deactive.onclick = function(ev) {
            var mainWidth = progressLine.offsetWidth;
            var rect = this.getBoundingClientRect();
            var newWidth = (rect.right - ev.clientX) / mainWidth * 100;

            this.style.width = newWidth + '%';
            active.style.width = (100 - newWidth) + '%';

            const seekTime = parseFloat(active.style.width, 10) * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        // Tua ngược nhạc (Music rewind)
        active.onclick = function(ev) {
            var mainWidth = progressLine.offsetWidth;
            var rect = this.getBoundingClientRect();
            var newWidth = (ev.clientX - rect.left) / mainWidth * 100;

            this.style.width = newWidth + '%';
            deactive.style.width = (100 - newWidth) + '%';

            const seekTime = parseFloat(active.style.width, 10) * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        // Bài tiếp theo
        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        // Bài trước
        preBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.preSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        // Lặp bài
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom;
            app.setConfig('isRandom', app.isRandom);
            randomBtn.classList.toggle('active', app.isRandom);
        }

        // Xử lý phát lại bài hát
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat;
            app.setConfig('isRepeat', app.isRepeat);
            repeatBtn.classList.toggle('active', app.isRepeat);
        }

        // Xử lý next song khi audio ended
        audio.onended = function() {
            if (app.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Xử lý khi ẩn vào phát nhạc trong playlist
        playlists.forEach(function(playlist) {
            playlist.onclick = function(e) {
                const songNode = e.target.closest('.music-list .items .item .actions .icon');
                if (songNode) {
                    app.currentIndex = Number(songNode.getAttribute('data-index'));
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }
            }
        });
    },
    loadCurrentSong: function() {
        songName.textContent = this.currentSong.name;
        artistName.textContent = this.currentSong.singer;
        playlistTitle.textContent = 'Best of 2024';
        songDuration.textContent = this.currentSong.length;
        cdThumb.src = this.currentSong.image;
        audio.src = this.currentSong.path;
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.current-play').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 500);
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    preSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();
        // Định nghĩa thuộc tính mới cho object
        this.defineProperties();
        // Lấng nghe xử lý sự kiện (DOM events)
        this.handleEvents();
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        // Render playlist
        this.render();
        // Hiển thị trạng thái ban đầu của repeatBtn và randomBtn
        randomBtn.classList.toggle('active', app.isRandom);
        repeatBtn.classList.toggle('active', app.isRepeat);
    }
}

app.start();