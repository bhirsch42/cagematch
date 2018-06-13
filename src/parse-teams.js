import _ from 'lodash'

export default function(rawTeams) {
  return rawTeams.map(rawTeam => {
    let team = {
      name: rawTeam['Name'],
      members: rawTeam['Members'].split(/\ *,\ */).map(member => {
        let split = member.split("*");
        return {
          name: split[0],
          required: split.length > 1
        }
      }),
      half: rawTeam["Half"],
      min: rawTeam["Min required"]
    }

    if (!_.find(team.members, {required: true})) {
      team.members.forEach(member => member.required = true);
    }

    return team
  })
}
