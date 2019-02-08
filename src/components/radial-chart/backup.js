{/* <div className='container'>
      <div className='dayLabel'>
        { moment(props.selectedDay).format('dddd, MMMM DD YYYY') }
      </div>
      <div className='dayOverview'>
        {
          dayInsights
            ? <svg
              className='radialBarChart'
              width={width}
              height={height}
            >
            <g transform={transform}>
                <circle
                  r={barHeight}
                  className='circle'
                >
                </circle>
                <g className='labels'>
                  <def>
                    <path
                      id='labelPath'
                      d={d}
                    />
                  </def>
                {
                  temp.map((key,i) =>
                    <text textAnchor='middle'>
                      <textPath
                        startOffset={`${i * 100 / numBars + 50 / numBars}%`}
                        xlinkHref='#labelPath'
                      >
                        {key+1}
                      </textPath>
                    </text>
                  )
                }
                </g>
                {
                  Object.values(obj).map((item, i) => {
                    return (
                      <path
                        d={`${arc(item, i)}`}
                      />
                    )
                  }
                  )
                }
                </g>
              </svg>
            : <span>
                No data recorded
              </span>
        }
      </div>
    </div>*/}
