
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import Lasso
import pickle

# Load the dataset
car_dataset = pd.read_csv('car data.csv')

# Encoding Categorical Columns
car_dataset.replace({'Fuel_Type': {'Petrol': 0, 'Diesel': 1, 'CNG': 2},
                     'Seller_Type': {'Dealer': 0, 'Individual': 1},
                     'Transmission': {'Manual': 0, 'Automatic': 1}}, inplace=True)

# Prepare Features (X) and Target Variable (Y)
X = car_dataset.drop(['Car_Name', 'Selling_Price'], axis=1)
Y = car_dataset['Selling_Price']

# Train-Test Split
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.1, random_state=2)

# Initialize and Train the Lasso Regression Model
lr = Lasso()
lr.fit(X_train, Y_train)

# Export the Trained Model using Pickle
pickle.dump(lr, open('ml_model.pkl', 'wb'))



