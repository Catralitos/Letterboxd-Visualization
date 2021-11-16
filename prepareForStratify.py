# coding=utf-8
#!/usr/bin/python
import pandas as pd # Import the library

data_df = pd.read_csv("data/listings.csv", delimiter=',')

data_df.drop(['id','name','host_id','host_name','neighbourhood_group','latitude','longitude','minimum_nights','number_of_reviews','last_review','reviews_per_month','calculated_host_listings_count','availability_365'], axis = 1, inplace=True)

data_df.dropna(inplace=True)

grouped_df = data_df.groupby(by=["neighbourhood", "room_type"], as_index = False).mean()

grouped_df.rename({'neighbourhood': 'parent', 'room_type': 'child'}, axis=1, inplace=True)

parents_list = grouped_df['parent'].unique()

for parent in parents_list:
    grouped_df = grouped_df.append({'child': parent, 'parent': "neighbourhood"}, ignore_index=True)

grouped_df = grouped_df.append({'child': "neighbourhood"}, ignore_index=True)

grouped_df.to_csv('data/ams_data.csv', index=False)