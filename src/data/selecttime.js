
export default {
    shortcuts: [
    {
        text: "最近5分钟",
        onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 1 * 5 * 60 * 1000);
        picker.$emit("pick", [start, end]);
        }
    },
    {
        text: "最近半小时",
        onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 1 * 30 * 60 * 1000);
        picker.$emit("pick", [start, end]);
        }
    },
    {
        text: "最近一小时",
        onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 1 * 60 * 60 * 1000);
        picker.$emit("pick", [start, end]);
        }
    },
    {
        text: "最近三小时",
        onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3 * 60 * 60 * 1000);
        picker.$emit("pick", [start, end]);
        }
    },
    {
        text: "最近24小时",
        onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 24 * 60 * 60 * 1000);
        picker.$emit("pick", [start, end]);
        }
    },
    {
        text: "最近7天",
        onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 7 * 24 * 60 * 60 * 1000);
        picker.$emit("pick", [start, end]);
        }
    },
    {
        text: "最近30天",
        onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 30 * 24 * 60 * 60 * 1000);
        picker.$emit("pick", [start, end]);
        }
    },
    {
        text: "当天",
        onClick(picker) {
        const end = new Date();
        end.setTime(end.setHours(0, 0, 0) + 86398999);              
        const start = new Date();
        start.setTime(start.setHours(0, 0, 0));
        picker.$emit("pick", [start, end]);
        }
    },
    {
        text: "本周",
        onClick(picker) {
        const end = new Date();
        const start = new Date();
            let minusDay = start.getDay() != 0 ? start.getDay()-1 : 6; //减去的天数
        start.setTime(start.setHours(0, 0, 0) - minusDay * 24 * 60 * 60 * 1000);
        end.setTime(start.getTime() + 6 * 24 * 60 * 60 * 1000 + 86398999)
        picker.$emit("pick", [start, end]);
        }
    },
    {
        text: "本月",
        onClick(picker) {
        const thisTime = new Date();
        let year = thisTime.getFullYear();
        let month = thisTime.getMonth();
        let start = new Date(new Date(year,month,1).setHours(0, 0, 0, 0)).getTime();//求出本月第一天    
    　　if(month == 11){//当为12月的时候年份需要加1 月份需要更新为0 也就是下一年的第一个月     
    　　  year ++;    
    　　  month = 0;//就为0    
    　   }else{//否则只是月份增加,以便求的下一月的第一天      
    　　  month ++;   
    　  }  
    　　let nextMonthDayOne = new Date(year,month,1); //下月的第一天    
    　　let end = new Date(new Date(nextMonthDayOne.getTime() - 86400000).setHours(0, 0, 0, 0)).getTime() + 86399999;//求出上月的最后一天  
        picker.$emit("pick", [start, end]);
        }
    }
    ]
  }
  