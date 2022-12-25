function JoScore(props: { teams: string[], scores: number[] }) {
    const { teams, scores } = props;

    return (
        <div className="jo-entry">
            <div className={"team left" + (scores[0] > scores[1] ? " winner" : "")}>{teams[0]}</div>
            <div className="scores">
                <span>{scores[0]}</span>
                <span>:</span>
                <span>{scores[1]}</span>
            </div>
            <div className={"team right" + (scores[0] < scores[1] ? " winner" : "")}>{teams[1]}</div>
        </div>
    )
}

export default JoScore;