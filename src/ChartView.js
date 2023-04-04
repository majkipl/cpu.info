import { useState, useEffect } from "react";
import Chart from "react-google-charts";

const URL = "ws://localhost:8080";

function ChartView() {
    const [cpu, setCpu] = useState([]);

    useEffect(() => {
        const socket = new WebSocket(URL);

        socket.onopen = () => {};

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            let tmp = [];
            let temp = [];

            if (cpu.length === 0) {
                for (let i = 0; i < data.cpus.length; i++)
                    temp[i] = [["Date", `CPU${i}`]];
            } else {
                temp = cpu;
            }

            for (let i = 0; i < data.cpus.length; i++) {
                if (temp[i].length > 100) {
                    temp[i].splice(1, 1);
                }
                tmp[i] = [...temp[i], [new Date(), data.cpus[i].load]];
            }

            setCpu(tmp);
        };

        // socket.onerror = (event) => {};

        // socket.onclose = (event) => {};

        return () => {
            socket.close();
        };
    }, [cpu]);

    return (
        <>
            <section>
                <h1>Wykres</h1>

                {cpu.map((item, index) => (
                    <Chart
                        key={index}
                        chartType="AreaChart"
                        width="100%"
                        height="400px"
                        data={item}
                        options={{
                            title: `CPU${index}`,
                            curveType: "function",
                            legend: { position: "bottom" },
                            series: {
                                0: { color: "#000000" },
                            },
                        }}
                    />
                ))}
            </section>
        </>
    );
}

export default ChartView;
