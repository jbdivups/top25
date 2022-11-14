import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {_} from 'lodash';

@Injectable()
export class AppService {
    constructor(private readonly httpService: HttpService) {
    }

    async getHello() {
        const teams = [];
        const response = await this.httpService.get('https://api.sportsdata.io/v3/cfb/scores/json/LeagueHierarchy?key=2f7feece6f7b481fbc2b9e972168d656').toPromise();
        response.data.forEach((conference) => {
            conference.Teams.forEach((team) => {
                if (team.ApRank)
                    teams.push({
                        ApRank: team.ApRank,
                        School: team.School,
                        Name: team.Name,
                        Wins: team.Wins,
                        Losses: team.Losses,
                        ConferenceName: conference.ConferenceName
                    });
            });
        });

        const conferences = _.groupBy(teams, 'ConferenceName');
        Object.keys(conferences).forEach((conference) => {
            const teams = conferences[conference].sort((a, b) => a.ApRank - b.ApRank);
            const matchingConference =
                conferences[conference] = {
                    conference: conference,
                    count: teams.length,
                    teams: teams,
                };
        });

        // @ts-ignore
        return Object.values(conferences).sort((a, b) => b.count - a.count);

    }

}
