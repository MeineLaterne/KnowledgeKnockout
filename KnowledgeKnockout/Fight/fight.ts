import { Socket } from 'socket.io';
import { SocketConnection } from '../socket_connection/SocketConnection';
import { User } from "../user/User";
import { Avatar } from "../user/Avatar";
import { Player } from './player';
import { Questions } from '../questions/Questions';
import { asyncTimeout } from '../helpers';

export class Fight {
    public players: Player[];
    public constructor(users: User[]) {
        this.players = [];
        for (const user of users) {
            this.players.push(new Player(user));
        }
        this.Start();
    }
    private async Start(): Promise<void> {
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
    }
}