# AccelFall Detector :

Implemented fall detection using the KFall dataset with ML models on accelerometer and gyroscope time-series data for accurate fall vs. non-fall classification.

Data Loading and Simulation: The project began by attempting to load the KFall dataset. If the dataset was not found or contained insufficient labels, a synthetic dataset was generated using the simulate_fall_data function. This simulated data included 'Normal', 'Pre-Fall', and 'Fall' activity, ensuring a balanced representation for training.

Data Preprocessing: The loaded (or simulated) data underwent preprocessing. This involved handling any missing values by forward-filling and then backward-filling, and then normalizing the sensor data (accelerometer and gyroscope readings) using StandardScaler to bring all features to a similar scale.

Sequence Creation: To capture temporal patterns crucial for fall detection, the preprocessed data was transformed into sequences. The create_sequences function created sliding windows of sensor readings (e.g., 50 time steps with a step size of 10) and assigned a label (from the end of the window) to each sequence. Labels were then one-hot encoded for multi-class classification.

Model Building: An LSTM (Long Short-Term Memory) neural network model was constructed. The model comprised multiple LSTM layers, followed by Batch Normalization and Dropout layers to prevent overfitting. A final Dense layer with a 'softmax' activation was used for multi-class classification, predicting the probability of each fall state.

Model Training: The LSTM model was trained on the generated sequences, split into training and validation sets. Training involved minimizing 'categorical_crossentropy' loss and maximizing 'accuracy'. Early Stopping and Model Checkpoint callbacks were used to optimize training, stopping if validation loss didn't improve and saving the best performing model weights.

Initial Model Evaluation: After training, the model's performance was evaluated on the held-out test set. A classification report provided detailed metrics (precision, recall, f1-score) for each class ('Normal', 'Pre-Fall', 'Fall'), and a confusion matrix visualized the true vs. predicted classifications. Training history (accuracy and loss over epochs) was also plotted.

New Random Test Data Generation: To assess the model's generalization capabilities, a new, independent set of synthetic fall detection data was generated using the simulate_fall_data function.

Preprocessing and Sequencing New Test Data: This new random data was then preprocessed and converted into sequences using the exact same methods (preprocess_data and create_sequences) as the original dataset.

Predictions on New Random Test Data: The previously trained and saved model (fall_detection_model.h5) was loaded and used to make predictions on the newly generated and processed random test sequences.

Evaluation on New Random Test Data: The model's performance on this unseen random data was thoroughly evaluated. A new confusion matrix was generated and visualized, and a classification report provided detailed metrics. A bar plot was also created to summarize the distribution of the predicted classes.
