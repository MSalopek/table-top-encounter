    counterDecrement(key) {
        // NOTE potential bug zone
        // react doesn't like nested state...
        // or hundreds of components...
        // this copies items state and changes counter in the copied item
        // then it sets the old state to new state
        // potentially re-rendering all items?
        console.log("CLICKED DOWN", key)
        let items_cp = this.state.items;
        for (let i=0; i<items_cp.length; i++) {
            if (items_cp[i].name === key) {
                let old_counter_val = items_cp[i].count;
                if (old_counter_val > 0) {
                    items_cp[i].count = old_counter_val - 1;
                }
                this.setState({ items: items_cp });
                break;
            }
        }

    }

    counterIncrement(key) {
        // NOTE potential bug zone
        // react doesn't like nested state...
        // or hundreds of components...
        // this copies items state and changes counter in the copied item
        // then it sets the old state to new state
        // potentially re-rendering all items?
        // console.log("CLICKED UP", key)
        // let items_cp = this.state.items;
        // for (let i=0; i<items_cp.length; i++) {
        //     if (items_cp[i].name === key) {
        //         let old_counter_val = items_cp[i].count;
        //         if (old_counter_val < 10) {
        //             items_cp[i].count = old_counter_val + 1;
        //         }
        //         this.setState({ items: items_cp });
        //         break;
        //     }
        // }
