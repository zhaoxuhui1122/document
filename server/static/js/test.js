 window.onload = function() {
        const list = document.getElementById('nav').children;
        for (var i = 0, len = list.length; i < len; i++) {
            list[i].onclick = function() {
                for (var j = 0; j < list.length; j++) {
                    list[j].className = '';
                }
                this.className = 'active';
            }
        }
    }