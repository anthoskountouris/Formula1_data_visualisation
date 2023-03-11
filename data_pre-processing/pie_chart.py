import seaborn as sns
import matplotlib.pyplot as plt

# Define the data
labels = ['British', 'Spanish', 'Dutch', 'Italian',
          'French', 'German', 'Australian', 'American']
percentages = [10, 15, 5, 20, 12, 8, 7, 23]

# Create the pie chart using Seaborn
sns.set_style("darkgrid")
plt.figure(figsize=(6, 6))
plt.pie(percentages, autopct='%1.1f%%', startangle=90)
plt.axis('equal')
plt.title('Driver Nationality distribution in F1')

# Legend
plt.legend(labels, loc='best')

plt.show()
