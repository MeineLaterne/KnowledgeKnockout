import { asyncTimeout } from '../helpers';
import { Questions } from '../questions/Questions';
import { SocketConnection } from '../socket_connection/SocketConnection';
import { Users } from '../user/Sessions';
import { User } from '../user/User';
import { Player } from './player';

export class Fight {
    public players: Player[] = [];
    public constructor(sessionIDs: string[]) {
        const users = <User[]>sessionIDs.map(sessionID => Users.get(sessionID).user);
        for (const user of users) {
            user.isInMatch = true;
            console.log('!!!!!!!!!!!!!!!!!!!', user, Users.get(user.sessionID));
        }

        const interval = setInterval(() => {
            console.log(users.every(user => !!SocketConnection.get(user.sessionID)));
            if (users.every(user => !!SocketConnection.get(user.sessionID))) {
                for (const user of users) {
                    this.players.push(new Player(user));
                }

                for (const player of this.players) {
                    player.socket.on('chatmessage', msg => {
                        for (const player_ of this.players) {
                            player_.socket.emit('chatmessage', { msg: msg, user: player.user.name });
                        }
                    });
                }

                this.Start();

                clearInterval(interval);
            }
        }, 100);
    }
    private async Start(): Promise<void> {
        console.log('match start');
        for (const player of this.players) {
            player.socket.emit('avatarInfo', this.players.map(player_ => ({ isThisPlayer: player.socket.id === player_.socket.id, avatars: player_.user.avatars.map(avatar => ({ topicId: avatar.topicId, level: avatar.level })) })));
        }

        for (let i = 0; i < this.players[0].user.avatars.length; i++) {
            const question = await Questions.getRandomQuestion(i);

            for (const player of this.players) {
                player.socket.emit('question', { id: question.id, content: question.content, time: question.secondsToSolve });
            }

            await asyncTimeout(question.secondsToSolve * 1000);

            if (this.players.every(player => player.answerIsCorrect)) {
                for (const player of this.players) {
                    player.score += player.user.getAvatar(i).level;
                }
            } else if (!this.players.every(player => player.answerIsCorrect) && this.players.some(player => player.answerIsCorrect)) {
                for (let j = 0; j < this.players.length; j++) {
                    const player = this.players[j];

                    if (player.answerIsCorrect) {
                        player.score += player.user.getAvatar(i).level;
                    } else {
                        player.score += Math.max(0, player.user.getAvatar(i).level - this.players[(j + 1) % this.players.length].user.getAvatar(i).level);
                    }
                }
            }

            for (const player of this.players) {
                player.socket.emit('roundResult', this.players.map(player_ => ({ isThisPlayer: player.socket.id === player_.socket.id, correct: player_.answerIsCorrect, score: player_.score })));
            }

            await asyncTimeout(3000);
        }

        for (let j = 0; j < this.players.length; j++) {
            const player = this.players[j];

            player.user.progress += player.score;
            player.socket.emit('matchend', this.players.map(player_ => ({ isThisPlayer: player.socket.id === player_.socket.id, score: player_.score, won: player.score > this.players[j + 1].score, progress: player.user.progress })));
        }

        await asyncTimeout(5000);

        for (const player of this.players) {
            player.user.isInMatch = false;
        }
    }
}