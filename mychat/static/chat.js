var demo = new Vue({
    el: '#mychat',
    data: {
        nickname: '',
        chatsock: null,
        newMessage: '',
        messages: [
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
            self.chatsock = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat" + window.location.pathname);
            self.chatsock.onmessage = function(message) {
                var data = JSON.parse(message.data);
                
                // skip showing our own message as we already show it
                // during sending. Probably we should do this on the backend
                // and skip broadcasting the message in the first place.
                // But that may require some way to exclude certain connection
                // from the Group ... hmmm.
                if (data['nickname'] == self.nickname) {
                    return;
                } 
                self.messages.push(data);
            }
            console.log(self.chatsock);
        },
        send: function() {
            var message = {
                nickname: this.nickname,
                text: this.newMessage
            }
            this.messages.push(message);
            this.chatsock.send(JSON.stringify(message));
            console.log(message);
            return false;
        }
    }
})
