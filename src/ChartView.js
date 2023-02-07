import { useState, useEffect } from "react";

// import SEO from 'components/atoms/SEO/SEO';
import Chart from "react-google-charts";

const URL = "ws://localhost:8080";

function ChartView() {
    const [cpu, setCpu] = useState([]);

    // const initCpuSeries = (index) => {
    //     console.log("ChartView : initCpuSeries");
    //     console.log(cpu.length);
    //     console.log(index);
    //     // let temp = [];
    //     // if (cpu.length === 0) {
    //     //   for (let i = 0; i < index; i++) temp[i] = [['Date', `CPU${i}`]];
    //     // }

    //     // console.log(temp);

    //     // setCpu(temp);
    // };

    // const controlCpu = (data, index) => {
    //     const tmp = [];

    //     for (let i = 0; i < index; i++) {
    //         cpu[i].length > 100 ? cpu[i].splice(1, 1) : cpu[i];
    //         tmp[i] = [...cpu[i], [new Date(), data.cpus[i].load]];
    //     }

    //     setCpu(tmp);
    // };

    useEffect(() => {
        const socket = new WebSocket(URL);

        socket.onopen = () => {
            // console.log("ws.onopen");
        };

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);

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

        socket.onerror = (event) => {
            console.info("ws.onerror");
        };

        socket.onclose = (event) => {
            // console.info("ws.onclose");
        };

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
