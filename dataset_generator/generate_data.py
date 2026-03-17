import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_production_data(records=500):
    machines = ['Line_01', 'Line_02', 'Line_03']
    data = []
    current_time = datetime.now() - timedelta(days=1)

    for i in range(records):
        timestamp = current_time + timedelta(minutes=i * 5) #each record is 5 minutes apart
        machine_id = np.random.choice(machines)
        
        #random number of output
        output = np.random.randint(40, 100)
        
        #random number of defects
        defects = np.random.randint(0, int(output * 0.1))
        
        #random temperature
        temperature = round(np.random.uniform(60, 95), 2)
        
        # determine status
        if temperature > 90 or defects > 8:
            status = 'Error'
        elif temperature > 85:
            status = 'Warning'
        else:
            status = 'Running'
            
        data.append([timestamp, machine_id, output, defects, temperature, status])

    df = pd.DataFrame(data, columns=['Timestamp', 'Machine_ID', 'Output', 'Defects', 'Temperature', 'Status'])
    
    os.makedirs('backend/data', exist_ok=True)
    
    # save csv file to backend/data folder
    output_path = 'backend/data/production_data.csv'
    df.to_csv(output_path, index=False)
    
    # save csv file to current directory
    df.to_csv('production_data.csv', index=False)
    
    print(f"Generated {len(df)} records!")
    print(f"Saved to: {output_path}")

if __name__ == "__main__":
    generate_production_data(500) # Generate 500 records