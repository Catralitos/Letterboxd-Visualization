# coding=utf-8
#!/usr/bin/python
import pandas as pd # Import the library

data_df = pd.read_csv("movie_data.csv", delimiter=',')

data_df.drop(['rating','nr_of_ratings','directors','runtime','genres','countries','actors'], axis = 1, inplace=True)

data_df.dropna(inplace=True)

grouped_df = data_df.groupby(by=["year", "title"], as_index = False).mean()

grouped_df.rename({'year': 'parent', 'title': 'child'}, axis=1, inplace=True)

parents_list = grouped_df['parent'].unique()

for parent in parents_list:
    grouped_df = grouped_df.append({'child': parent, 'parent': "year"}, ignore_index=True)

grouped_df = grouped_df.append({'child': "year"}, ignore_index=True)

grouped_df.to_csv('circular_data.csv', index=False)