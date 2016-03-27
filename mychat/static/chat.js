var demo = new Vue({
    el: '#mychat',
    data: {
        nickname: '',
        chatsock: null,
        newMessage: '',
        messages: [
            { text: 'hello'},
            { text: 'world'}
        ]
    },
    ready: function() {
        var self = this;
        swal({
            title: "Input",
            text: "Enter your nickname:",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "nickname"
        },
        function(inputValue) {
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("You need to write your nickname!");
                return false
            }
            self.nickname = inputValue;
            swal("Nice!", "You nickname: " + inputValue, "success");
            self.connect();
        });
    },
    methods: {
        connect: function() {
            var self = this;
            var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
            self.chatsock = new WebSocket(ws_scheme + '://' + window.location.host + "/chat" + window.location.pathname);
            self.chatsock.onmessage = function(message) {
                var data = JSON.parse(message.data);
                self.messages.push(data);
            }
            console.log(self.chatsock);
        },
        send: function() {
            this.messages.push({text: this.newMessage});
            var message = {
                nickname: this.nickname,
                text: this.newMessage
            }
            this.chatsock.send(JSON.stringify(message));
            console.log(message);
            return false;
        }
    }
})
